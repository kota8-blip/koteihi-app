<template>
  <div>
    <div class="login-container">
      <div class="login-box">
        <h2>ログイン</h2>
        <div class="input-group">
          <label for="username">ユーザー名</label>
          <input type="text" id="username" v-model="username">
        </div>
        <div class="input-group">
          <label for="password">パスワード</label>
          <input type="password" id="password" v-model="password">
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
    <div class="register-container">
      <div class="register-box">
        <h2>ユーザー登録</h2>
        <div class="input-group">
          <label for="username">ユーザー名</label>
          <input type="text" id="username" v-model="registername">
        </div>
        <div class="input-group">
          <label for="password">パスワード</label>
          <input type="password" id="password" v-model="registerpassword">
        </div>
        <BaseButton
          :button-text="'登録'"
          :is-disabled="!registername || !registerpassword"
          :bg-color="!registername || !registerpassword ? '#f0f0f0' : '#007bff'"
          :text-color="!registername || !registerpassword ? '#d4cccc' : '#ffffff'"
          @click="register"
        />
      </div>
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
.login-container,
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box,
.register-box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  margin: 20px;
}
.input-group {
  margin-bottom: 15px;
}
.input-group label {
  display: block;
  margin-bottom: 5px;
}
.input-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
