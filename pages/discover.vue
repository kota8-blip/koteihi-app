<template>
  <div class="discover-page">
    <mt-header
      fixed
      title="探す"
    />
    <a href="https://h5.ele.me/exchange/">
      <img
        :src="discover1"
        alt=""
      >
    </a>
    <div style="height:12px;" />
    <a href="https://goods.m.duiba.com.cn/mobile/appItemDetail?appItemId=1544968&from=login&spm=14695.1.1.1">
      <img
        :src="discover2"
        alt=""
      >
    </a>
    <clock />
    <count-button />
    <discover-list />
    <Tabbar page="1" />
  </div>
</template>

<script>
  import config from "~/config";
  import Tabbar from "~/components/tabbar";
  import CountButton from "~/components/countButton";
  import Clock from '../components/clock.vue';
  import DiscoverList from '../components/discoverList.vue';

  export default {
    components: {
      Tabbar,
      CountButton,
      Clock,
      DiscoverList
    },
    head: {
      title: "探す"
    },
    data() {
      return {
        discover1: `${config.IMG_URL}discover/discover1.jpg`,
        discover2: `${config.IMG_URL}discover/discover2.jpg`,
      }
    }
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
