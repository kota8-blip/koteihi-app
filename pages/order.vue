<template>
  <div class="order-page">
    <mt-header
      fixed
      title="注文"
    />
    <clock />
    <count-button />
    <login-record v-if="!userInfo || !userInfo.mobile" />
    <order-list v-if="userInfo && userInfo.mobile" />
    <!-- <div
      v-if="!userInfo || !userInfo.mobile"
      class="no-data">
      <svg class="nodata" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="#f5f5f5" stroke="#ddd" stroke-width="3"/>
        <path d="M70 85 Q100 65 130 85" stroke="#999" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="75" cy="90" r="8" fill="#999"/>
        <circle cx="125" cy="90" r="8" fill="#999"/>
        <text x="100" y="150" font-size="16" text-anchor="middle" fill="#999">注文なし</text>
      </svg>
      <p v-if="!userInfo||!userInfo.user_id">
        ログイン後にテイクアウトの注文履歴を確認する
      </p>
      <p v-if="userInfo&&userInfo.user_id">
        現在、注文情報はありません
      </p>
      <button
        v-if="!userInfo||!userInfo.user_id"
        class="login"
        @click="$router.push('/login')"
      >
        ログインしてください
      </button>
    </div> -->
    <Tabbar page="2" />
  </div>
</template>

<script>
  import config from "~/config";
  import Tabbar from "~/components/tabbar";
  import {
    mapGetters
  } from "vuex";
  import CountButton from "~/components/countButton";
  import Clock from '../components/clock.vue';
  import OrderList from '../components/orderList.vue';
  import LoginRecord from '../components/loginRecord.vue';
  // import userInfo from "../store/userInfo";

  export default {
    components: {
      Tabbar,
      CountButton,
      Clock,
      OrderList,
      LoginRecord
    },
    head: {
      title: "注文"
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"])
    },
    mounted() {
    },
  };

</script>

<style lang="scss">
  @import "../assets/styles/mixin";

  .order-page {
    padding: px2rem(88px) 0 53px 0;

  // //   .no-data {
  // //     text-align: center;

  // //     .nodata {
  // //       width: px2rem(400px);
  // //       height: px2rem(400px);
  // //       margin: 15vh auto px2rem(10px) auto;
  // //     }

  // //     p {
  // //       color: #6a6a6a;
  // //       font-size: px2rem(32px);
  // //       margin-bottom: px2rem(15px);
  // //     }

  // //     .login {
  // //       width: px2rem(240px);
  // //       height: px2rem(80px);
  // //       background: #56d176;
  // //       border: none;
  // //       color: #fff;
  // //       font-size: px2rem(28px);
  // //       border-radius: 2px;
  // //     }
  // //   }
  }

</style>
