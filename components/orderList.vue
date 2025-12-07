<template>
  <div class="orderlist_container">
    <h2>注文履歴</h2>
    <input
      type="text"
      placeholder="店舗名検索"
      v-model="searchShopName"
      style="margin-bottom: 16px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;"
    >
    <button
      @click="toggleSortOrder"
      style="margin-bottom: 16px;
      padding: 8px 16px;
      cursor: pointer;"
    >{{ sortOrder === 'desc' ? '日付順 (降順)' : '日付順 (昇順)' }}</button>
    <ul
      v-if="filteredOrderList.length"
      style="display: flex;
      flex-direction: row;
      gap: 16px;
      font-size: 12px;"
    >
      <ul
        style="padding: 0;
        margin: 0;"
      >
        <li
          class="order_header"
          style="display: grid;
          grid-template-columns: 40px 150px 150px 120px;
          gap: 8px;
          list-style: none;"
        >
          <span>番号</span>
          <span>店名</span>
          <span>商品名</span>
          <span>日付</span>
        </li>
        <li
          v-for="(item, index) in filteredOrderList"
          :key="item.id"
          class="order_li"
          @click="openModal(item)"
          style="display: grid;
          grid-template-columns: 40px 150px 150px 120px;
          gap: 8px;
          cursor: pointer;
          list-style: none;"
        >
          <span>{{ index + 1 }}</span>
          <span>{{ item.shopName }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.orderDate }}</span>
        </li>
      </ul>
      <div v-if="showmodal" class="modal_overlay" @click.self="closeModal">
        <div class="modal_content">
          <h3>注文詳細</h3>
          <p>商品名: {{ selectedOrder.name }}</p>
          <p>数量: {{ selectedOrder.itemCount }}</p>
          <p>価格: {{ selectedOrder.totalAmount }}</p>
          <button @click="closeModal">閉じる</button>
          <button @click="orderAgain()">再注文</button>
        </div>
      </div>
    </ul>
    <div v-else>
      注文履歴がありません。
    </div>
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
        orderListArr: [],
        showmodal: false,
        selectedOrder: null,
        searchShopName: '',
        sortOrder: 'desc',
        cartItems: []
      }
    },
    computed: {
      ...mapGetters('userInfo', ['userInfo']),
      filteredOrderList() {
        if (!this.searchShopName) {
          return this.orderListArr;
        }
        return this.orderListArr.filter(item =>
          item.shopName.includes(this.searchShopName)
        )
      }
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
      },
      openModal(item) {
      this.selectedOrder = item;
      this.showmodal = true;
      },
      closeModal() {
        this.showmodal = false;
        this.selectedOrder = null;
      },
      toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        this.orderListArr = [...this.orderListArr].sort((a, b) => {
          const diff = new Date(a.orderDate) - new Date(b.orderDate);
          return this.sortOrder === 'desc' ? -diff : diff;
        });
      },
      orderAgain() {
        if (this.selectedOrder) {
          this.$store.dispatch('cart/addItem', {
            user_id: this.userInfo.user_id,
            name: this.selectedOrder.name,
            price: this.selectedOrder.totalAmount / this.selectedOrder.itemCount,
            quantity: this.selectedOrder.itemCount
          });
          this.$router.push({ path: '/user' });
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    transition: box-shadow 0.2s;
  }
  .order_li:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.16);
  }
  .order_header {
    background-color: #f2f3f5;
    color: #555;
    font-weight: 500;
    border-radius: 4px;
    margin-bottom: 4px;
    padding: 10px 12px;
    letter-spacing: 0.5px;
    box-shadow: none;
  }
  .modal_overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal_content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
