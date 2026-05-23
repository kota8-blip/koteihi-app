<template>
  <div class="settings-page">
    <div class="settings-inner">
      <section class="section">
        <div class="section-title">一般</div>
        <div class="section-body">
          <div class="setting-row" @click="color">
            <span class="row-label">テーマカラー</span>
            <span class="row-action">変更 ›</span>
          </div>
        </div>
      </section>

      <div v-if="colorModal">
        <colorModal @closeColorModal="color" />
      </div>

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
import colorModal from '~/components/_archive/colorModal.vue';
export default {
  name: 'Settings',
  components: {
    colorModal,
  },
  data() {
    return {
      colorModal: false,
      portalLoading: false,
    };
  },
  computed: {
    isPremium() {
      return this.$store.state.isPremium;
    },
  },
  methods: {
    color() {
      this.colorModal = !this.colorModal;
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
  background-color: #f2f2f7;
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
