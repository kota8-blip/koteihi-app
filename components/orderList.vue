<template>
  <div class="orderlist_container">
    <h2>注文履歴</h2>
    <ul
      v-if="orderListArr.length"
    >
      <li
        v-for="item in orderListArr"
        :key="item.id"
        class="order_li"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    food
  } from "~/assets/services/order";
  import { mapGetters } from "vuex";

  export default {
      name: 'OrderList',
    data() {
      return {
        orderListArr: []
      }
    },
    computed: {
      ...mapGetters('userInfo', ['userInfo'])
    },
    mounted() {
      this.initData();
    },
    methods: {
      async initData() {
        let res = await food(this.userInfo.user_id);
        if (res && Array.isArray(res)) {
          this.orderListArr = [...res];
        }
      }
    }
  }
</script>

<style scoped>
  .orderlist_container {
    padding: 10px;
    background-color: #f8f8f8;
  }
  .order_li {
    background-color: #fff;
    margin-bottom: 8px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
