<template>
  <div class="discover-page">
    <mt-header
      fixed
      title="検索"
    />
    <clock />
    <count-button />
    <login-record v-if="!userInfo || !userInfo.mobile"
      :actionRecord="'検索なし'"
      :loginPrompt="'ログイン後に検索履歴を確認する'"
    />
    <discover-list v-if="userInfo && userInfo.mobile" />
    <Tabbar page="1" />
  </div>
</template>

<script>
  import config from "~/config";
  import Tabbar from "~/components/tabbar";
  import CountButton from "~/components/countButton";
  import Clock from '../components/clock.vue';
  import DiscoverList from '../components/discoverList.vue';
  import { mapGetters } from "vuex";
  import LoginRecord from '../components/loginRecord.vue';

  export default {
    components: {
      Tabbar,
      CountButton,
      Clock,
      DiscoverList,
      LoginRecord
    },
    head: {
      title: "検索"
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"])
    },
  };

</script>

<style lang="scss">
  @import "../assets/styles/mixin";

  .discover-page {
    padding: px2rem(88px) 0 53px 0;

    a {
      display: block;
    }
  }

</style>
