<template>
  <div class="page">

    <!-- ソートドロップダウン -->
    <!-- moved to list-header -->

    <!-- 一覧リスト -->
    <div class="list-header">
      <div class="sort-dropdown-wrap">
        <div v-if="showSortMenu" class="sort-menu-backdrop" @click="showSortMenu = false" />
        <button class="sort-trigger" @click="showSortMenu = !showSortMenu">
          並び替え：{{ currentSortLabel }} <span class="sort-arrow">▼</span>
        </button>
        <div v-if="showSortMenu" class="sort-menu">
          <div
            v-for="opt in sortOptions"
            :key="opt.value"
            class="sort-menu-item"
            :class="{ 'is-active': sortMode === opt.value, 'is-locked': opt.premium && !isPremium }"
            @click="selectSort(opt)"
          >
            <span>{{ opt.label }}</span>
            <span v-if="opt.premium && !isPremium" class="menu-lock">🔒</span>
            <span v-else-if="sortMode === opt.value" class="menu-check">✓</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cost-list">
      <div class="cost-row" v-for="item in sortedCosts" :key="item.id">
        <div class="cost-left">
          <div class="cost-name">{{ item.name || '名称未設定' }}</div>
          <div class="cost-meta">
            <span v-if="item.category" class="cost-category">{{ item.category }}</span>
            <span v-if="item.billing_day != null && item.billing_day !== ''" class="cost-billing">
              {{ item.billing_day === 0 ? '末日' : '毎月' + item.billing_day + '日' }}
            </span>
          </div>
        </div>
        <div class="cost-right">
          <div class="cost-amount">¥{{ item.amount.toLocaleString() }}</div>
          <div class="cost-actions">
            <button class="btn-edit" @click="openEditModal(item)">編集</button>
            <button class="btn-delete" @click="deleteItem(item.id)">削除</button>
          </div>
        </div>
      </div>
      <div v-if="fixedCosts.length === 0" class="empty">固定費がまだ登録されていません</div>
      <div class="add-row">
        <button class="add-btn" @click="openAddModal">＋ 追加</button>
      </div>
    </div>

    <!-- 合計バー -->
    <div class="total-bar">
      <span class="total-label">月合計</span>
      <span class="total-amount">¥{{ totalAmount.toLocaleString() }}</span>
    </div>

    <!-- アップグレード誘導モーダル -->
    <div v-if="showUpgradeModal" class="modal-overlay" @click.self="showUpgradeModal = false">
      <div class="modal upgrade-modal">
        <div class="upgrade-icon">🔒</div>
        <h3>有料プランの機能です</h3>
        <p class="upgrade-desc">{{ upgradeDesc }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showUpgradeModal = false">閉じる</button>
          <button class="btn-upgrade">プランをアップグレード</button>
        </div>
      </div>
    </div>

    <!-- 追加 / 編集モーダル -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editTarget ? '編集' : '固定費を追加' }}</h3>
        <div class="form-group">
          <label>サービス名</label>
          <input v-model="form.name" type="text" placeholder="例: Netflix">
        </div>
        <div class="form-group">
          <label>金額（円）</label>
          <input v-model.number="form.amount" type="number" min="0" placeholder="例: 1490">
        </div>
        <div class="form-group">
          <label>カテゴリ</label>
          <select v-model="form.category">
            <option value="">選択しない</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>引落日（毎月何日）</label>
          <select v-model="form.billing_day">
            <option :value="null">選択しない</option>
            <option v-for="d in 31" :key="d" :value="d">{{ d }}日</option>
            <option :value="0">末日</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">キャンセル</button>
          <button class="btn-save" @click="saveItem" :disabled="!form.amount">保存</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'auth',
  data() {
    return {
      showModal: false,
      showUpgradeModal: false,
      upgradeDesc: '',
      showSortMenu: false,
      sortMode: 'default',
      sortOptions: [
        { value: 'default',      label: '登録順',         premium: false },
        { value: 'date',         label: '引落日が近い順', premium: true  },
        { value: 'amount_desc',  label: '金額が多い順',   premium: true  },
        { value: 'amount_asc',   label: '金額が少ない順', premium: true  },
      ],
      editTarget: null,
      form: {
        name: '',
        amount: '',
        category: '',
        billing_day: null,
      },
      categories: ['動画配信', '音楽', 'ゲーム', 'ニュース', 'ソフトウェア', '健康', '保険', '通信', 'その他'],
    }
  },
  computed: {
    isPremium() {
      return this.$store.state.isPremium;
    },
    currentSortLabel() {
      const opt = this.sortOptions.find(o => o.value === this.sortMode);
      return opt ? opt.label : '登録順';
    },
    fixedCosts() {
      return this.$store.state.fixedCosts;
    },
    sortedCosts() {
      if (!this.isPremium || this.sortMode === 'default') return this.fixedCosts;
      if (this.sortMode === 'date') {
        const today = new Date().getDate();
        const score = (d) => {
          if (d === null || d === '' || d === undefined) return 999;
          const day = d === 0 ? 31 : d;
          return day >= today ? day - today : day + (31 - today);
        };
        return [...this.fixedCosts].sort((a, b) => score(a.billing_day) - score(b.billing_day));
      }
      if (this.sortMode === 'amount_desc') {
        return [...this.fixedCosts].sort((a, b) => b.amount - a.amount);
      }
      if (this.sortMode === 'amount_asc') {
        return [...this.fixedCosts].sort((a, b) => a.amount - b.amount);
      }
      return this.fixedCosts;
    },
    totalAmount() {
      return this.fixedCosts.reduce((sum, item) => sum + Number(item.amount), 0);
    },
  },
  async mounted() {
    await this.$store.dispatch('loadFixedCosts');
  },
  methods: {
    openAddModal() {
      if (!this.isPremium && this.fixedCosts.length >= 3) {
        this.upgradeDesc = '無料プランでは固定費を3件まで登録できます。4件目以降の登録は有料プランをご利用ください。';
        this.showUpgradeModal = true;
        return;
      }
      this.editTarget = null;
      this.form = { name: '', amount: '', category: '', billing_day: null };
      this.showModal = true;
    },
    openEditModal(item) {
      this.editTarget = item;
      this.form = { ...item };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editTarget = null;
    },
    async saveItem() {
      if (this.editTarget) {
        await this.$store.dispatch('editFixedCost', { ...this.form, id: this.editTarget.id });
      } else {
        await this.$store.dispatch('addFixedCost', this.form);
      }
      this.closeModal();
    },
    async deleteItem(id) {
      await this.$store.dispatch('deleteFixedCost', id);
    },
    setSortMode(mode) {
      if (!this.isPremium) {
        this.showUpgradeModal = true;
        return;
      }
      this.sortMode = this.sortMode === mode ? 'default' : mode;
    },
    selectSort(opt) {
      if (opt.premium && !this.isPremium) {
        this.showSortMenu = false;
        this.upgradeDesc = '並び替え機能は有料プランでご利用いただけます。';
        this.showUpgradeModal = true;
        return;
      }
      this.sortMode = opt.value;
      this.showSortMenu = false;
    },
    openUpgradeModal() {
      this.showUpgradeModal = true;
    },
  },
}
</script>

<style scoped>
.page {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

/* 合計バー */
.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
.total-label {
  font-size: 16px;
  font-weight: 700;
  color: #444;
  margin-right: 12px;
  letter-spacing: 0.04em;
}
.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #222;
}
.add-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}
.add-btn:hover {
  background: #444;
}
.add-row {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}

/* リスト */
.cost-list {
  margin-bottom: 16px;
}
.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4px;
  border-bottom: 1px solid #f0f0f0;
}
.cost-row:hover {
  background: #fafafa;
  border-radius: 8px;
}
.cost-left {
  flex: 1;
  min-width: 0;
}
.cost-name {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cost-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.cost-category {
  font-size: 11px;
  color: #888;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 2px 8px;
}
.cost-billing {
  font-size: 12px;
  color: #aaa;
}
.cost-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-left: 16px;
  flex-shrink: 0;
}
.cost-amount {
  font-size: 20px;
  font-weight: bold;
  color: #222;
  white-space: nowrap;
}
.cost-actions {
  display: flex;
  gap: 6px;
}
.empty {
  text-align: center;
  color: #aaa;
  padding: 40px 0;
}

/* 編集・削除ボタン */
.btn-edit {
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.btn-edit:hover {
  color: #1976d2;
  background: #e3f0fb;
}
.btn-delete {
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.btn-delete:hover {
  color: #e57373;
  background: #fdecea;
}

/* モーダル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 24px;
  width: 90%;
  max-width: 440px;
}
.modal h3 {
  margin: 0 0 20px;
  font-size: 18px;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #222;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
.btn-cancel {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}
.btn-save {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
}
.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ソートドロップダウン */
.list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.sort-dropdown-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
}
.sort-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}
.sort-trigger:hover {
  background: #f5f5f5;
}
.sort-arrow {
  font-size: 10px;
  color: #999;
}
.sort-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.sort-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 180px;
  z-index: 101;
  overflow: hidden;
}
.sort-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-size: 13px;
  cursor: pointer;
  color: #333;
}
.sort-menu-item:hover {
  background: #f5f5f5;
}
.sort-menu-item.is-active {
  color: #388e3c;
  font-weight: bold;
}
.sort-menu-item.is-locked {
  color: #bbb;
}
.menu-lock {
  font-size: 11px;
}
.menu-check {
  font-size: 13px;
  color: #388e3c;
}

/* アップグレードモーダル */
.upgrade-modal {
  text-align: center;
}
.upgrade-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.upgrade-modal h3 {
  margin: 0 0 10px;
}
.upgrade-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.btn-upgrade {
  background: #f9a825;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}
.btn-upgrade:hover {
  background: #f57f17;
}
</style>
