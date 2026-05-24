<template>
  <div class="settings-page">
    <div class="settings-inner">
      <section class="section">
        <div class="section-title">一般</div>
        <div class="section-body">
          <div class="setting-row" @click="colorExpanded = !colorExpanded">
            <span class="row-label">テーマカラー</span>
            <span class="row-action">{{ colorExpanded ? '閉じる' : '変更 ›' }}</span>
          </div>
          <div v-if="colorExpanded" class="color-picker-backdrop" @click="colorExpanded = false" />
          <div v-if="colorExpanded" class="color-picker">
            <div
              v-for="c in colors"
              :key="c.code"
              class="color-chip"
              :class="{ active: currentColor === c.code }"
              :style="{ background: c.code }"
              @click.stop="selectColor(c.code)"
            >
              <span class="color-chip-label">{{ c.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">プラン</div>
        <div class="section-body">
          <div v-if="isPremium" class="setting-row">
            <div>
              <span class="row-label">プレミアムプラン</span>
              <span class="badge-premium">加入中</span>
            </div>
            <button class="btn-portal" :disabled="portalLoading" @click="openPortal">
              {{ portalLoading ? '処理中...' : 'サブスク管理' }}
            </button>
          </div>
          <div v-else class="setting-row">
            <div>
              <span class="row-label">無料プラン</span>
              <span class="badge-free">無料</span>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-title">サポート</div>
        <div class="section-body">
          <div class="setting-row" @click="showContactModal = true">
            <span class="row-label">お問い合わせ</span>
            <span class="row-action">フォームを開く ›</span>
          </div>
        </div>
      </section>
      <button class="btn-logout" @click="showLogoutModal = true">ログアウト</button>

    </div>

    <!-- お問い合わせモーダル -->
    <div v-if="showContactModal" class="modal-overlay" @click.self="closeContact">
      <div class="modal">
        <p class="modal-title">お問い合わせ</p>
        <div v-if="contactSent" class="contact-success">
          <p>送信しました。<br>お返事お待ちください。</p>
          <button class="modal-btn-cancel" @click="closeContact">閉じる</button>
        </div>
        <div v-else>
          <div class="contact-group">
            <label>返信用メールアドレス <span style="color:#e53935">*</span></label>
            <input v-model="contactEmail" type="email" placeholder="example@email.com">
          </div>
          <div class="contact-group">
            <label>件名</label>
            <input v-model="contactSubject" type="text" placeholder="例: 機能の要望">
          </div>
          <div class="contact-group">
            <label>内容</label>
            <textarea v-model="contactMessage" rows="5" placeholder="ご自由にお書きください" />
          </div>
          <button class="modal-btn-logout" style="background:#007bff" :disabled="!contactEmail || !contactMessage || contactLoading" @click="sendContact">
            {{ contactLoading ? '送信中...' : '送信する' }}
          </button>
          <button class="modal-btn-cancel" @click="closeContact">キャンセル</button>
        </div>
      </div>
    </div>

    <!-- ログアウト確認モーダル -->
    <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
      <div class="modal">
        <p class="modal-title">ログアウトしますか？</p>
        <p class="modal-desc">ログアウトするとログイン画面に戻ります。</p>
        <button class="modal-btn-logout" @click="logout">ログアウト</button>
        <button class="modal-btn-cancel" @click="showLogoutModal = false">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      colorExpanded: false,
      portalLoading: false,
      showLogoutModal: false,
      showContactModal: false,
      contactEmail: '',
      contactSubject: '',
      contactMessage: '',
      contactLoading: false,
      contactSent: false,
      colors: [
        { name: 'ライト', code: '#ffffff' },
        { name: 'ダーク', code: '#1a1a1a' },
      ],
    };
  },
  computed: {
    isPremium() {
      return this.$store.state.isPremium;
    },
    currentColor() {
      return this.$store.state.currentColor;
    },
  },
  methods: {
    selectColor(code) {
      this.$store.commit('SET_CURRENT_COLOR', code);
    },
    closeContact() {
      this.showContactModal = false;
      this.contactEmail = '';
      this.contactSubject = '';
      this.contactMessage = '';
      this.contactSent = false;
    },
    async sendContact() {
      this.contactLoading = true;
      try {
        await fetch('https://formspree.io/f/xdajlddo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: this.contactEmail, subject: this.contactSubject, message: this.contactMessage }),
        });
        this.contactSent = true;
      } catch (err) {
        alert('送信に失敗しました。もう一度お試しください。');
      } finally {
        this.contactLoading = false;
      }
    },
    logout() {
      this.showLogoutModal = false;
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    async openPortal() {
      this.portalLoading = true;
      try {
        const res = await this.$axios.post('/api/create-portal-session');
        window.location.href = res.data.url;
      } catch (err) {
        alert('エラーが発生しました。もう一度お試しください。');
        this.portalLoading = false;
      }
    },
  },
}
</script>

<style scoped>
.settings-page {
  min-height: calc(100vh - 64px);
}
.settings-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  box-sizing: border-box;
}
.section {
  margin-bottom: 32px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  padding-left: 4px;
}
.section-body {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.setting-row:last-child {
  border-bottom: none;
}
.row-label {
  font-size: 16px;
  color: #111;
}
.row-action {
  font-size: 15px;
  color: #aaa;
}
.color-picker-backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
}
.color-picker {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  padding: 16px;
  flex-wrap: wrap;
}
.color-chip {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.20);
  transition: border-color 0.15s;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}
.color-chip.active {
  border-color: #007bff;
}
.color-chip-label {
  font-size: 11px;
  font-weight: 600;
  color: #888;
}
.badge-premium {
  display: inline-block;
  margin-left: 8px;
  background: #007bff;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  vertical-align: middle;
}
.badge-free {
  display: inline-block;
  margin-left: 8px;
  background: #e0e0e0;
  color: #666;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  vertical-align: middle;
}
.btn-portal {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}
.btn-portal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-logout {
  display: block;
  width: calc(100% - 32px);
  margin: 8px 16px 0;
  padding: 14px;
  background: none;
  border: 1.5px solid #e53935;
  border-radius: 10px;
  color: #e53935;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  position: relative;
  z-index: 1;
}
.btn-logout:hover {
  background: rgba(229, 57, 53, 0.1);
}
/* ログアウト確認モーダル */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  width: 88%;
  max-width: 320px;
  text-align: center;
}
.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}
.modal-desc {
  font-size: 13px;
  color: #888;
  margin-bottom: 24px;
  line-height: 1.6;
}
.modal-btn-logout {
  display: block;
  width: 100%;
  padding: 13px;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
}
.modal-btn-cancel {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  padding: 8px;
}
.contact-group {
  margin-bottom: 14px;
  text-align: left;
}
.contact-group label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}
.contact-group input,
.contact-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical;
}
.contact-success {
  text-align: center;
  color: #388e3c;
  font-size: 15px;
  line-height: 1.8;
  padding: 8px 0 16px;
}
</style>
