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
.color-picker {
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
</style>
