<template>
  <div class="page-wrapper">

    <!-- Hero -->
    <section class="hero">
      <div class="app-title">koteihi</div>
      <p class="hero-catch">毎月いくら固定で出ていくか、<br>即答できますか？</p>
      <p class="hero-sub">kotehiなら、固定費をまとめて一目で管理できます。</p>
      <a class="btn-cta" @click.prevent="scrollToRegister">今すぐ無料で始める</a>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="feature-item">
        <div class="feature-icon">📋</div>
        <div class="feature-text">
          <div class="feature-title">固定費を一覧管理</div>
          <div class="feature-desc">サブスクや家賃など、毎月かかる支出をまとめて記録</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📊</div>
        <div class="feature-text">
          <div class="feature-title">グラフで推移を確認</div>
          <div class="feature-desc">月々の固定費の変化をグラフで見える化</div>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">💴</div>
        <div class="feature-text">
          <div class="feature-title">月合計を瞬時に把握</div>
          <div class="feature-desc">合計金額が常に表示されるので、固定費に即答できる</div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing">
      <h2 class="pricing-title">料金プラン</h2>
      <div class="pricing-cards">
        <div class="pricing-card">
          <div class="plan-name">無料プラン</div>
          <div class="plan-price">¥0<span>/月</span></div>
          <ul class="plan-features">
            <li>固定費5件まで登録</li>
            <li>月合計の確認</li>
            <li>カテゴリ管理</li>
          </ul>
        </div>
        <div class="pricing-card is-premium">
          <div class="plan-badge">おすすめ</div>
          <div class="plan-name">プレミアム</div>
          <div class="plan-price">¥480<span>/月</span></div>
          <ul class="plan-features">
            <li>固定費 無制限登録</li>
            <li>グラフで推移を確認</li>
            <li>並び替え機能</li>
            <li>カテゴリ管理</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 新規登録 -->
    <div id="register" class="card">
      <h2>新規登録</h2>
      <p class="section-description">ユーザー名とパスワードを決めるだけで登録できます。</p>
      <div class="input-group">
        <label for="registername">ユーザー名</label>
        <input type="text" id="registername" v-model="registername" placeholder="好きなユーザー名を入力">
      </div>
      <div class="input-group">
        <label for="registerpassword">パスワード</label>
        <input type="password" id="registerpassword" v-model="registerpassword" placeholder="好きなパスワードを入力">
      </div>
      <BaseButton
        :button-text="'登録する'"
        :is-disabled="!registername || !registerpassword"
        :bg-color="!registername || !registerpassword ? '#f0f0f0' : '#007bff'"
        :text-color="!registername || !registerpassword ? '#d4cccc' : '#ffffff'"
        @click="register"
      />
      <p v-if="registerError" class="error-msg">{{ registerError }}</p>
    </div>

    <div class="divider">
      <span>すでにアカウントをお持ちの方</span>
    </div>

    <!-- ログイン -->
    <div class="card">
      <h2>ログイン</h2>
      <div class="input-group">
        <label for="username">ユーザー名</label>
        <input type="text" id="username" v-model="username" placeholder="ユーザー名を入力">
      </div>
      <div class="input-group">
        <label for="password">パスワード</label>
        <input type="password" id="password" v-model="password" placeholder="パスワードを入力">
      </div>
      <BaseButton
        :button-text="'ログイン'"
        :is-disabled="!username || !password"
        :bg-color="!username || !password ? '#f0f0f0' : '#007bff'"
        :text-color="!username || !password ? '#d4cccc' : '#ffffff'"
        @click="login"
      />
    </div>

  </div>
</template>

<script>
import BaseButton from '~/components/baseButton.vue';
export default {
  layout: 'empty',
  name: 'LogIn',
  components: { BaseButton },
  head() {
    return {
      title: 'koteihi | 固定費管理アプリ',
      meta: [
        { hid: 'description', name: 'description', content: '毎月いくら固定で出ていくか、即答できますか？kotehiは、サブスクや家賃など毎月かかる固定費をシンプルに管理できるアプリです。無料で始められます。' },
        { hid: 'og:title', property: 'og:title', content: 'koteihi | 固定費管理アプリ' },
        { hid: 'og:description', property: 'og:description', content: '毎月いくら固定で出ていくか、即答できますか？kotehiは、サブスクや家賃など毎月かかる固定費をシンプルに管理できるアプリです。' },
        { hid: 'og:url', property: 'og:url', content: 'https://koteihi-app.vercel.app/login' },
      ],
    };
  },
  data() {
    return {
      username: '',
      password: '',
      registername: '',
      registerpassword: '',
      registerError: ''
    };
  },
  methods: {
    scrollToRegister() {
      document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    },
    async login() {
      await this.$store.dispatch('logIn', { username: this.username, password: this.password });
      document.activeElement?.blur();
      window.scrollTo(0, 0);
      await this.$nextTick();
      this.$router.push('/');
    },
    async register() {
      this.registerError = '';
      try {
        await this.$store.dispatch('register', { username: this.registername, password: this.registerpassword });
        document.activeElement?.blur();
        window.scrollTo(0, 0);
        await this.$nextTick();
        this.$router.push('/');
      } catch (err) {
        this.registerError = err.response?.data?.error || '登録に失敗しました';
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0 0 60px;
}

/* Hero */
.hero {
  background: #007bff;
  color: #fff;
  text-align: center;
  padding: 56px 24px 48px;
}
.app-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 20px;
  opacity: 0.95;
}
.hero-catch {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.6;
  margin-bottom: 12px;
}
.hero-sub {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 28px;
  line-height: 1.6;
}
.btn-cta {
  display: inline-block;
  background: #fff;
  color: #007bff;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 32px;
  border-radius: 30px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
}

/* Features */
.features {
  background: #fff;
  padding: 32px 24px;
  max-width: 480px;
  margin: 0 auto;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}
.feature-item:last-child {
  margin-bottom: 0;
}
.feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.feature-title {
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.feature-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
}

/* Pricing */
.pricing {
  padding: 32px 16px;
  max-width: 480px;
  margin: 0 auto;
}
.pricing-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}
.pricing-cards {
  display: flex;
  gap: 12px;
}
.pricing-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
}
.pricing-card.is-premium {
  border: 2px solid #007bff;
}
.plan-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #007bff;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.plan-name {
  font-size: 13px;
  font-weight: 700;
  color: #555;
  margin-bottom: 8px;
  text-align: center;
}
.plan-price {
  font-size: 24px;
  font-weight: 800;
  color: #222;
  text-align: center;
  margin-bottom: 12px;
}
.plan-price span {
  font-size: 13px;
  font-weight: 400;
  color: #999;
}
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}
.plan-features li {
  font-size: 12px;
  color: #666;
  padding: 4px 0;
  border-top: 1px solid #f0f0f0;
  line-height: 1.5;
}
.plan-features li:first-child {
  border-top: none;
}

/* Forms */
.card {
  background: #fff;
  border-radius: 10px;
  padding: 24px 20px;
  max-width: 360px;
  margin: 0 auto 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.section-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}
.input-group {
  margin-bottom: 14px;
}
.input-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}
.input-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}
.divider {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  margin: 8px 0 16px;
}
.error-msg {
  color: #e53935;
  font-size: 13px;
  margin-top: 8px;
  text-align: center;
}

/* モバイル */
@media (max-width: 360px) {
  .hero-catch {
    font-size: 19px;
  }
  .plan-price {
    font-size: 20px;
  }
  .plan-features li {
    font-size: 11px;
  }
}
</style>
