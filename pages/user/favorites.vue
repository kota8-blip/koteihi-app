<template>
  <div favorites-header>
    <Toast />
    <h2>お気に入り店舗</h2>
    <p
      v-if="favoriteItems.length === 0">まだお気に入り店舗がありません。</p>
    <ul
      v-else>
      <li v-for="(shop, index) in favoriteItemsList"
          :key="shop.id"
          class="order_li"
          @click="openModal(shop)"
          style="display: grid;
          grid-template-columns: 40px 300px;
          gap: 8px;
          cursor: pointer;
          list-style: none;"
      >
        <span>{{ index + 1 }}</span>
        <span>{{ shop.shopName }}</span>
      </li>
    </ul>
    <div v-if="showmodal" class="modal_overlay" @click.self="closeModal">
      <div class="modal_content">
        <h3>注文詳細</h3>
        <p>店舗名: {{ selectedOrder.shopName }}</p>
        <p>商品名: {{ selectedOrder.name }}</p>
        <button @click="closeModal">閉じる</button>
        <button @click="orderAgain()">再注文</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {favoriteItems} from '~/assets/services/favorite';
  import { mapGetters } from 'vuex';
  import { updateCart, addToCart } from '~/assets/services/cart';
  import Toast from '~/components/toast.vue';

export default {
  name: 'FavoritesPage',
  components: {
    Toast
  },
  data() {
    return {
      favoriteItemsList: [],
      showmodal: false,
      selectedOrder: null,
    };
  },

  computed: {
    ...mapGetters('userInfo', ['userInfo']),
    favoriteItems() {
      return this.favoriteItemsList;
    }
  },

  mounted() {
    this.initData();
  },

  methods: {
    async initData() {
      if (this.favoriteItems && this.favoriteItems.length > 0) {
        return;
      }
      let res = await favoriteItems(this.$store.getters['userInfo/userInfo'].user_id);
      if (res && Array.isArray(res)) {
        this.$store.commit('favorite/setFavoriteItems', res);
        this.favoriteItemsList = res;
      }
    },
    openModal(shop) {
      this.selectedOrder = shop;
      this.showmodal = true;
      },
    closeModal() {
      this.showmodal = false;
      this.selectedOrder = null;
    },
    async orderAgain() {
        // Indicator.open('読み込み中...');
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const existingItem = this.$store.state.cart.cartItems.find(
            item => item.name === this.selectedOrder.name
          );

          if (existingItem) {
            const res = await updateCart(existingItem.id, {
              user_id: this.userInfo.user_id,
              name: existingItem.name,
              price: existingItem.price,
              quantity: existingItem.quantity + this.selectedOrder.itemCount,
            });

          const updated = this.$store.state.cart.cartItems.map(
            i => i.id === existingItem.id? res : i
          );
          this.$store.commit('cart/SetCartItems', updated);
        } else {
          const res = await addToCart({
            user_id: this.userInfo.user_id,
            name: this.selectedOrder.name,
            price: this.selectedOrder.totalAmount / this.selectedOrder.itemCount,
            quantity: this.selectedOrder.itemCount
          });

          this.$store.commit('cart/SetCartItems', [...this.$store.state.cart.cartItems, res]);
        }
          this.$store.commit('userInfo/setToast', { type: 'success', message: 'カートに追加されました' });
          this.closeModal();
          this.$router.push({ path: '/user' });
        } catch (error) {
          Toast('通信エラーが発生しました');
        } finally {
          Indicator.close();
        }
      },
  },
};
</script>

<style scoped>
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
