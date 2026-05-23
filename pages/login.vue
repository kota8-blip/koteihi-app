<template>
  <div class="page-wrapper">
    <div class="app-title">固定費管理</div>
    <p class="app-description">毎月の固定費を記録・管理するアプリです。</p>

    <div class="card">
      <h2>ログイン</h2>
      <p class="section-description">すでにアカウントをお持ちの方はこちらからログインしてください。</p>
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

    <div class="divider">
      <span>または</span>
    </div>

    <div class="card">
      <h2>新規登録</h2>
      <p class="section-description">初めてご利用の方はこちらからアカウントを作成してください。ユーザー名とパスワードを決めるだけで登録できます。</p>
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
    </div>
  </div>
</template>

<script>
import BaseButton from '~/components/baseButton.vue';
export default {
  layout: 'empty',
  name: 'LogIn',
  components: { BaseButton },
  data() {
    return {
      username: '',
      password: '',
      registername: '',
      registerpassword: ''
    };
  },
  methods: {
    async login() {
      await this.$store.dispatch('logIn', { username: this.username, password: this.password });
      this.$router.push('/');
    },
    async register() {
      await this.$store.dispatch('register', { username: this.registername, password: this.registerpassword });
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40px 16px;
}
.app-title {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 6px;
}
.app-description {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
}
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
  font-size: 15px;
}
.divider {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  margin: 8px 0 16px;
}
</style>
