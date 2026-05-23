<template>
  <div class="success-page">
    <div v-if="loading" class="status-box">
      <p class="msg">支払いを確認中...</p>
    </div>
    <div v-else-if="error" class="status-box error-box">
      <div class="icon">⚠️</div>
      <h2>確認できませんでした</h2>
      <p class="msg">{{ error }}</p>
      <button class="btn-home" @click="$router.push('/')">トップへ戻る</button>
    </div>
    <div v-else class="status-box success-box">
      <div class="icon">✅</div>
      <h2>アップグレード完了！</h2>
      <p class="msg">プレミアムプランへようこそ。<br>すべての機能が使えるようになりました。</p>
      <button class="btn-home" @click="$router.push('/')">トップへ戻る</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessPage',
  layout: 'empty',
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  async mounted() {
    // JWTをlocalStorageから復元してaxiosヘッダーにセット
    if (process.client) {
      const token = localStorage.getItem('token');
      if (token) {
        this.$store.commit('SET_JWT', token);
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
      }
    }
    const sessionId = this.$route.query.session_id;
    if (!sessionId) {
      this.error = 'セッションIDが見つかりません。';
      this.loading = false;
      return;
    }
    try {
      const res = await this.$axios.post('/api/verify-payment', { sessionId });
      if (res.data.success) {
        const newToken = res.data.token;
        this.$store.commit('SET_JWT', newToken);
        this.$store.commit('SET_IS_PREMIUM', true);
        if (process.client) {
          localStorage.setItem('token', newToken);
        }
        this.$axios.setHeader('Authorization', `Bearer ${newToken}`);
      }
    } catch (err) {
      this.error = err.response?.data?.error || '支払いの確認中にエラーが発生しました。';
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.success-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}
.status-box {
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.icon {
  font-size: 48px;
  margin-bottom: 16px;
}
h2 {
  font-size: 20px;
  margin: 0 0 12px;
  color: #333;
}
.msg {
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px;
}
.btn-home {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 15px;
  cursor: pointer;
}
.btn-home:hover {
  background: #43a047;
}
.error-box h2 {
  color: #e53935;
}
</style>
