<template>
  <div class="login-record-page" v-if="!userInfo || !userInfo.mobile">
    <div class="no-data">
      <svg class="nodata" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="#f5f5f5" stroke="#ddd" stroke-width="3"/>
        <path d="M70 85 Q100 65 130 85" stroke="#999" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="75" cy="90" r="8" fill="#999"/>
        <circle cx="125" cy="90" r="8" fill="#999"/>
        <text x="100" y="150" font-size="16" text-anchor="middle" fill="#999">{{ actionRecord }}</text>
      </svg>
      <p v-if="!userInfo||!userInfo.user_id">
        {{ loginPrompt }}
      </p>
      <p v-if="userInfo&&userInfo.user_id">
        現在、注文情報はありません
      </p>
      <button
        v-if="!userInfo||!userInfo.user_id"
        class="login"
        @click="$router.push('/login')"
      >
        ログインする
      </button>
    </div>
  </div>
</template>

  <script>
  export default {
    name: "loginRecord",
    props: {
      actionRecord: {
        type: String,
        default: "注文なし",
      },
      loginPrompt: {
        type: String,
        default: "ログイン後にテイクアウトの注文履歴を確認する"
      }
    }
  }
  </script>

  <style>
    .no-data {
      text-align: center;
    }
      .nodata {
        width: 100px;
        height: 100px;
        margin: 15vh auto 10px auto;
      }

      p {
        color: #6a6a6a;
        font-size: px2rem(32px);
        margin-bottom: px2rem(15px);
      }

      .login {
        width: px2rem(240px);
        height: px2rem(80px);
        background: #56d176;
        border: none;
        color: #fff;
        font-size: px2rem(28px);
        border-radius: 2px;
      }
  </style>
