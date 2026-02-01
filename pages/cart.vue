<template>
  <div class="cart_container">
    <Toast />
    <h3>カート内容</h3>

    <ul
      v-if="cartItems.length">
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} : {{ item.price }}円 x {{ item.quantity }}
        <button :disabled="isLoading" @click="addCount(item)">+</button>
        <button :disabled="isLoading" @click="downCount(item)">-</button>
        <button :disabled="isLoading" @click="deleteItem(item)">削除</button>
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
  import { updateCart, deleteCart } from '~/assets/services/cart';
  // import { Toast, Indicator } from 'mint-ui';
  import Toast from '../components/toast.vue';

  export default {
    name: 'CartPage',
    components: {
      Toast
    },
    data() {
      return {
        isLoading: false,
        errorMessage: '',
      };
    },
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

      if(this.$store.getters['userInfo/successToast']) {
        console.log("Displaying success toast:", this.$store.getters['userInfo/successToast']);
        this.$myToast('success', 'カートに追加されました');
        this.$store.commit('userInfo/setToast', { type: 'success', message: false });
      }
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
        async addCount(item) {
          console.log('addCount', item);
            Indicator.open('読み込み中...');
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));

              const res = await updateCart(item.id, {
                user_id: this.userInfo.user_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity + 1,
              });

              const updated = this.$store.state.cart.cartItems.map(i => i.id === item.id ? res : i);
              this.$store.commit('cart/SetCartItems', updated);
              Toast('数量を増やしました');
            } catch (error) {
              Toast('通信エラーが発生しました');
            } finally {
              Indicator.close();
            }
        },
        async downCount(item) {
          if(item.quantity > 1) {
            Indicator.open('読み込み中...');
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));

              const res = await updateCart(item.id, {
                user_id: this.userInfo.user_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity - 1,
              });

              const updated = this.$store.state.cart.cartItems.map(i => i.id === item.id ? res : i);
              this.$store.commit('cart/SetCartItems', updated);
              Toast('数量を減らしました');
            } catch (error) {
              Toast('通信エラーが発生しました');
            } finally {
              Indicator.close();
            }
          }
        },
        async deleteItem(item) {
        Indicator.open('削除中...');
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await deleteCart(item.id);

          const updated = this.$store.state.cart.cartItems.filter(i => i.id !== item.id);
          this.$store.commit('cart/SetCartItems', updated);
          Toast('削除しました');
        } catch (error) {
          Toast('通信エラーが発生しました');
        } finally {
          Indicator.close();
        }
      }
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
