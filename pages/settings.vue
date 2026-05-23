<template>
  <div class="settings-page">
    <h2>一般</h2>
    <div class="setting-row" @click="color">
      <p>テーマ</p>
      <button>　色</button>
    </div>
    <div v-if="colorModal">
      <colorModal @closeColorModal="color" />
    </div>

    <h2>プラン</h2>
    <div v-if="isPremium" class="setting-row">
      <p>プレミアムプラン加入中</p>
      <button class="btn-portal" :disabled="portalLoading" @click="openPortal">
        {{ portalLoading ? '処理中...' : 'サブスク管理' }}
      </button>
    </div>
    <div v-else class="setting-row">
      <p>無料プラン</p>
      <span class="plan-label">無料</span>
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
  width: 100%;
  padding: 40px 20px;
  text-align: left;
  border: 1px solid black;
  margin-bottom: 30px;
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  background-color: rgba(157, 157, 157, 0.3);
}
button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #000000;
}
.btn-portal {
  background-color: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}
.btn-portal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.plan-label {
  font-size: 14px;
  color: #888;
}
</style>
