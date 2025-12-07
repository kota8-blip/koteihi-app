<template>
  <div class="userdetail-page">
    <div class="head">
      <nav :style="`background-image: url('${banner}');`">
        <i
          class="mintui mintui-back"
          @click="$router.go(-1);"
        />
      </nav>
    </div>
    <div class="userdetail-page">
      <div class="user-info">
        <h2>{{ userInfo.name }}</h2>
        <p>電話番号: {{ userInfo.mobile }}</p>
        <p>メールアドレス: {{ userInfo.email }}</p>
        <p>登録日: {{ userInfo.joinDate }}</p>
      </div>
    </div>
    <Tabbar page="3" />
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import Tabbar from "~/components/tabbar";
  export default {
  components: { Tabbar },
    data() {
      return {
        banner: "/banner1.png", // 例：ダミー画像パス
      };
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"])
    }
  };
</script>

<style lang="scss">
  @import "../assets/styles/mixin";

  .head {
      height: px2rem(200px);

      nav {
        height: px2rem(200px);
        background-position: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        padding: px2rem(10px);
        position: relative;

        .mintui-back {
          font-size: px2rem(46px);
          color: #2694ee;
        }
      }
    }
</style>
