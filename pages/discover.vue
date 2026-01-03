<template>
  <div class="discover-page">
    <mt-header
      fixed
      title="検索"
    />
    <clock />
    <count-button />
    <div v-if="userInfo && userInfo.mobile" class="search-box">
      <input
        type="text"
        v-model="searchWord" placeholder="検索"
      />
      <input
        type="button"
        value="検索"
        @click="$router.push('/search')"
      />
      <ul>
        <li
          v-for="item in filteredList"
          :key="item.id"
          @click="searchWord = item.name"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <login-record v-if="!userInfo || !userInfo.mobile"
      :actionRecord="'検索なし'"
      :loginPrompt="'ログイン後に検索履歴を確認する'"
    />
    <discover-list v-if="userInfo && userInfo.mobile"
      :discoverListArr="discoverListArr"
    />
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
  import Search from "./search.vue";
  import {
    past
  } from "~/assets/services/discover";

  export default {
    components: {
      Tabbar,
      CountButton,
      Clock,
      DiscoverList,
      LoginRecord,

    },
    head: {
      title: "検索"
    },
    data() {
      return {
        searchWord: '',
        discoverListArr: []
      }
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"]),
      // ...mapGetters("discoverList", ["discoverListArr"]),

      filteredList() {
        if (!this.searchWord) return [];
        return this.discoverListArr.filter(item =>
          item.name.includes(this.searchWord)
        )
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      async initData() {
        let res = await past(this.userInfo.user_id);
        if (res && Array.isArray(res)) {
          this.discoverListArr = [...res];
        }
      }
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
