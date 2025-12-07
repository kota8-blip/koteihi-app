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
