<template>
  <div class="home-page">
    <mt-header
      fixed
      title="トップページ"
    >
      <mt-button
        slot="right"
        icon="search"
        @click="$router.push('/search')"
      />
    </mt-header>
    <clock />
    <div class="date">
      {{ 日付 }}{{ 曜日 }}
    </div>
    <div :class="['button-space', { 'button-space-active': isClockActive }]">
      <Message
        :message="message"
        @messageClicked="handleMessageClicked"
      />
      <CountButton />
    </div>
    <nav class="nav-container">
      <div
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        @click="$router.push({path:'/newretail', query:{ title: item.text }})"
      >
        <img
          :src="item.imgUrl"
          alt=""
        >
        {{ item.text }}
      </div>
    </nav>
    <div class="show-list">
      <a href="https://h5.ele.me/ranking/#type=quality_meal&activity_id=1&title=%E5%93%81%E8%B4%A8%E5%A5%97%E9%A4%90&navType=0&geohash=wtw3ycy6v7pe">
        <img
          :src="show1"
          alt=""
        >
      </a>
      <a href="https://h5.ele.me/sales/#geohash=wtw3ycy6v7pe">
        <img
          :src="show2"
          alt=""
        >
      </a>
    </div>
    <div style="height:5px;clear:both" />
    <div class="swiper">
      <mt-swipe
        :auto="3000"
        style="height:100px;"
      >
        <mt-swipe-item
          v-for="(item, index) in bannerList"
          :key="index"
        >
          <img
            :src="item"
            alt=""
          >
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div style="height:10px;clear:both" />
    <p class="my_coment">
      {{ コメント }}
    </p>
    <p class="shoplist-title">
      —— おすすめの加盟店 ——
    </p>
    <ShopList />
    <Tabbar page="0" />
  </div>
</template>

<script>
  import Tabbar from "~/components/tabbar";
  import ShopList from "~/components/shopList";
  import config from "~/config";
  import {
    getHomeData
  } from "~/assets/services/common";
  import Message from '../components/Message.vue';
  import CountButton from '../components/countButton.vue';
  import Clock from '../components/clock.vue';

  export default {
    components: {
      Tabbar,
      ShopList,
      Clock,
      Message,
      CountButton
    },
    data() {
      return {
        data: "",
        navList: [],
        show1: `${config.IMG_URL}show1.png`,
        show2: `${config.IMG_URL}show2.png`,
        bannerList: [
          `${config.IMG_URL}banner/4a6f8262a2a006c0bd6ba31b137c4jpeg.png`,
          `${config.IMG_URL}banner/146be328e7121c456ac67f54b59fbjpeg.png`,
          `${config.IMG_URL}banner/b28f567a846a21f01aa39a55d6facjpeg.png`,
        ],
        コメント: '本日のおススメは、こ・ち・ら！！',
        日付: '',
        曜日: '',
        message: 'こんにちは、今日はどんな気分ですか！',
        isClockActive : false,
      };
    },
    async asyncData() {
      const res = await getHomeData();
      // resが配列またはオブジェクトかチェック
      if (res && Array.isArray(res)) {
        res.map(item => {
          item.imgUrl = config.IMG_URL + item.imgUrl;
        });
        return { navList: res };
      } else if (res && res.navList) {
        res.navList.map(item => {
          item.imgUrl = config.IMG_URL + item.imgUrl;
        });
        return { navList: res.navList };
      }
      return { navList: [] };
    },
    created() {
      const getDay = (day) => {
        const days = ['（日）', '（月）', '（火）', '（水）', '（木）', '（金）', '（土）'];
        return days[day] || '';
      };
      this.日付 = new Date().toLocaleDateString();
      this.曜日 = getDay(new Date().getDay());
    },
    methods: {
      handleMessageClicked() {
        this.isClockActive = !this.isClockActive;
      }
    },
  };
</script>

<style lang="scss">
  @import "../assets/styles/mixin";

  .home-page {
    background-color: #fff;
    padding: px2rem(88px) 0 53px 0;

    .button-space {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-left: 5px;
      color: rgb(168, 24, 24);
    }

    .button-space-active {
      color: rgb(35, 135, 97);
    }

    .nav-container {
      @include fj();
      flex-wrap: wrap;
      margin-bottom: px2rem(30px);

      .nav-item {
        @include wh(20%, 80px);
        text-align: center;
        color: #666;
        font-size: px2rem(24px);
        padding-top: px2rem(10px);

        img {
          display: block;
          margin: 0 auto;
          @include wh(50px, 50px);
        }
      }
    }

    .swiper {
      padding: 0 0.4rem;
    }

    .my_coment {
      font-size: px2rem(28px);
      color: #333;
      text-align: center;
      margin-bottom: px2rem(20px);
    }

    .shoplist-title {
      @include fj(center);
      font-size: px2rem(30px);
      margin-bottom: px2rem(20px);
    }

    .show-list {
      padding: 0 0.4rem;

      a {
        display: inline-block;
        width: 49%;
        height: auto;

        &:nth-last-of-type(1) {
          float: right;
        }
      }
    }
  }

</style>
