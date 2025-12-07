<template>
  <div class="cart_container">
    <h3>カート内容</h3>
    <ul
      v-if="cartItems.length">
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} : {{ item.price }}円 x {{ item.quantity }}
        <button @click="addCount(item)">+</button>
        <button @click="downCount(item)">-</button>
        <button @click="deleteItem(item)">削除</button>
      </li>
      <li>
        合計: {{ totalPrice }}円
      </li>
    </ul>
  </div>
</template>

<script>
  import { cartItems } from '~/assets/services/cart';
  import { mapGetters } from 'vuex';

  export default {
    name: 'CartPage',
    computed: {
      ...mapGetters('userInfo', ['userInfo']),
      cartItems() {
        return this.$store.getters['cart/cartItems'];
      },
      totalPrice() {
        return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      async initData() {
        if (this.$store.state.cart.cartItems.length > 0) {
          return;
        }
        let res = await cartItems(this.userInfo.user_id);
        if (res && Array.isArray(res)) {
          this.$store.commit('cart/SetCartItems', res);
          }
        },
        addCount(item) {
        item.quantity++;
      },
      downCount(item) {
        if(item.quantity > 1) {
          item.quantity--;
        }
      },
      deleteItem(item) {
        this.$store.dispatch('cart/deleteItem', item);
      },
    },
  }
</script>

<style scoped>
  .cart_container {
    height: 80vh;
    padding: 10px;
    background-color: #f0f0f0;
  }
</style>
