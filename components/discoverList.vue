<template>
  <div class="discoverlist_container">
    <h2>検索リスト履歴</h2>
    <ul
      v-if="discoverListArr.length"
    >
      <li
        v-for="item in discoverListArr"
        :key="item.id"
        class="discover_li"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  // import {
  //   past
  // } from "~/assets/services/discover";
  import { mapGetters } from "vuex";

  export default {
    name: 'DiscoverList',
    // data() {
    //   return {
    //     discoverListArr: []
    //   }
    // },
    props: {
      discoverListArr: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      ...mapGetters('userInfo', ['userInfo'])
    },
    // mounted() {
    //   this.initData();
    // },
    // methods: {
    //   async initData() {
    //     let res = await past(this.userInfo.user_id);
    //     if (res && Array.isArray(res)) {
    //       this.discoverListArr = [...res];
    //     }
    //   }
    // },
  };

</script>

<style scoped>
  .discoverlist_container {
    padding: 10px;
    background-color: #f8f8f8;
  }
  .discover_li {
    background-color: #fff;
    margin-bottom: 8px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
