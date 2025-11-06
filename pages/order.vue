<template>
  <div class="order-page">
    <mt-header
      fixed
      title="注文"
    />
    <clock />
    <count-button />
    <order-list v-if="userInfo && userInfo.mobile" />
    <div class="no-data">
      <img
        :src="nodata"
        class="nodata"
        alt=""
      >
      <p v-if="!userInfo||!userInfo.user_id">
        ログイン後にテイクアウトの注文を確認する
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
    </div>
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
  // import userInfo from "../store/userInfo";

  export default {
    components: {
      Tabbar,
      CountButton,
      Clock,
      OrderList
    },
    head: {
      title: "注文"
    },
    data() {
      return {
        nodata: `${config.IMG_URL}nodata.png`,
      };
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"])
    }
  };

</script>

<style lang="scss">
  @import "../assets/styles/mixin";

  .order-page {
    padding: px2rem(88px) 0 53px 0;

    .no-data {
      text-align: center;

      .nodata {
        width: px2rem(400px);
        height: px2rem(400px);
        margin: 15vh auto px2rem(10px) auto;
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
    }
  }

</style>
