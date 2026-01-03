<template>
  <div class="orderlist_container">
    <h2>注文履歴</h2>
    <div class="search_controls">
      <input
        v-if="selectedFilter === 'price'"
        type="text"
        placeholder="最小価格"
        v-model="minPrice"
        class="search_input"
      >
      <span v-if="selectedFilter === 'price'" class="price_separator">～</span>
      <input
        v-if="selectedFilter === 'price'"
        type="text"
        placeholder="最大価格"
        v-model="maxPrice"
        class="search_input"
      >
      <input
        v-else
        type="text"
        placeholder="店舗名検索"
        v-model="searchShopName"
        class="search_input"
      >
      <select @change="filteredOption($event.target.value)" class="filter_select">
        <option value="">絞り込み条件を選択</option>
        <option value="shopName">店舗名</option>
        <option value="price">価格範囲</option>
        <option value="category">カテゴリー</option>
        <option value="rating">評価</option>
      </select>
      <button
        @click="deleteFilters()"
        class="clear_button"
      >クリア</button>
    </div>
    <div class="validation_errors">
      <p v-if="priceValidationError" class="error_message">{{ priceValidationError }}</p>
      <p v-if="shopNameValidationError" class="error_message">{{ shopNameValidationError }}</p>
      <p v-if="filteredOrderList.length" class="info_message">{{ filteredOrderList.length }}件の店舗が見つかりました
      </p>
      <p v-else>該当する店舗がありません</p>
    </div>
    <button
      @click="toggleSortOrder"
      style="margin-bottom: 16px;
      padding: 8px 16px;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 4px;"
    >{{ sortOrder === 'desc' ? '日付順 (降順)' : '日付順 (昇順)' }}</button>
    <button
      @click="toggleOnly"
      style="margin-left: 8px;
      margin-bottom: 16px;
      padding: 8px 16px;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 4px;"
      :class="{active: pickedFavorite()}"
    >お気に入り</button>
    <div class="pagination">
      <p>{{ displayRange }}</p>

      <div class="pagination-controls">
        <button @click="prevPage" :disabled="isPrevDisabled">前へ</button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{active: page === currentPage}"
        >
          {{ page }}
        </button>

        <button @click="nextPage" :disabled="isNextDisabled">次へ</button>
      </div>

      <select @change="changePerPage($event.target.value)">
        <option value="10">10件</option>
        <option value="20">20件</option>
        <option value="50">50件</option>
      </select>
    </div>
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
          grid-template-columns: 40px 150px 150px 120px 80px;
          gap: 8px;
          list-style: none;"
        >
          <span>番号</span>
          <span>店名</span>
          <span>商品名</span>
          <span>日付</span>
          <span>お気に入り</span>
        </li>
        <li
          v-for="(item, index) in paginatedOrders"
          :key="item.id"
          class="order_li"
          @click="openModal(item)"
          style="display: grid;
          grid-template-columns: 40px 150px 150px 120px 80px;
          gap: 8px;
          cursor: pointer;
          list-style: none;"
        >
          <span>{{ (currentPage - 1) * perPage + index + 1 }}</span>
          <span>{{ item.shopName }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.orderDate }}</span>
          <span
            class="favorite-icon"
            :class="{ active: isFavorite(item) }"
            @click.stop="toggleFavorite(item)"
          >
            ♥
          </span>
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
  import { addToCart, updateCart } from "../assets/services/cart";
  import { favoriteItems, addToFavorite, updateFavorite, deleteFavorite } from "~/assets/services/favorite";
  import { Toast, Indicator } from "mint-ui";
  import Validate from "../assets/utils/validate";

  export default {
      name: 'OrderList',
    data() {
      return {
        orderListArr: [],
        showmodal: false,
        selectedOrder: null,
        searchShopName: '',
        debounceTimer: null,
        sortOrder: 'desc',
        cartItems: [],
        orders: [],
        currentPage: 1,
        perPage: 10,
        favorites: [],
        showFavoriteOnly: false,
        originalOrderListArr: [],
        selectedFilter: '',
        minPrice: '',
        maxPrice: '',
        // filteredAmount: '',
      }
    },
    computed: {
      ...mapGetters('userInfo', ['userInfo']),
      filteredOrderList() {
        let result = this.originalOrderListArr;

        // 店舗名フィルター
        if (this.selectedFilter === 'shopName' && this.searchShopName) {
          result = result.filter(item => item.shopName.includes(this.searchShopName));
        }

        // 価格範囲フィルター
        if (this.selectedFilter === 'price' && this.minPrice && this.maxPrice) {
          result = result.filter(item => item.totalAmount <= parseFloat(this.maxPrice) && item.totalAmount >= parseFloat(this.minPrice));
        }

        // カテゴリーフィルター
        if (this.selectedFilter === 'category' && this.searchShopName) {
          result = result.filter(item => item.category && item.category.includes(this.searchShopName));
        }

        // 評価フィルター
        if (this.selectedFilter === 'rating' && this.searchShopName) {
          result = result.filter(item => String(item.rating) === this.searchShopName);
        }

        // 店舗名検索
        if (this.searchShopName && !this.selectedFilter) {
          result = result.filter(item => item.shopName.includes(this.searchShopName));
        }

        // お気に入りフィルター
        if (this.showFavoriteOnly) {
          result = result.filter(item => this.isFavorite(item));
        }

        return result;
      },
      priceValidationError() {
        // 優先順位1: 数値チェック
        if (Validate.numberError(this.minPrice) || Validate.numberError(this.maxPrice)) {
          return '数字を入力してください';
        }
        // 優先順位2: 大小チェック
        if (!Validate.minPrice(this.minPrice, this.maxPrice)) {
          return '最小価格は最大価格より小さい必要があります';
        }
        return '';
      },
      shopNameValidationError() {
        if (Validate.overShopNameNumber(this.searchShopName)) {
          return '店舗名は50文字以内で入力してください';
        }
        return '';
      },
      displayRange() {
        const start = (this.currentPage - 1) * this.perPage + 1;
        const end = Math.min(this.currentPage * this.perPage, this.filteredOrderList.length);
        return `全${this.filteredOrderList.length}件中 ${start}〜${end}件を表示`;
      },
      isPrevDisabled() {
        return this.currentPage === 1;
      },
      isNextDisabled() {
        return this.currentPage === this.totalPages;
      },
      totalPages() {
        return Math.ceil(this.filteredOrderList.length / this.perPage);
        this.totalPages.push.this.filteredAmount;
      },
      paginatedOrders() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.filteredOrderList.slice(start, end);
      },
    },
    watch: {
      searchShopName(newVal) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.handleSearch(newVal);
        }, 500);
      }
    },
    mounted() {
      this.initData();
      this.initFavorites();
    },
    methods: {
      async initData() {
        let res = await food(this.userInfo.user_id);
        if (res && Array.isArray(res)) {
          this.originalOrderListArr = [...res];
          this.orderListArr = [...res];
        }
      },
      async initFavorites() {
        let res = await favoriteItems(this.userInfo.user_id);
        if (res && Array.isArray(res)) {
          this.favorites = [...res];
        }
      },
      deleteFilters() {
        this.searchShopName = '';
        this.minPrice = '';
        this.maxPrice = '';
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
      toggleOnly() {
        this.showFavoriteOnly = !this.showFavoriteOnly;
        this.currentPage = 1; // 1ページ目に戻す
      },
      pickedFavorite() {
        return this.showFavoriteOnly;
      },
      async orderAgain() {
        Indicator.open('読み込み中...');
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

          const updated = this.$store.state.cart.cartItems.map(i =>
            i.id === existingItem.id? res : i
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
          Toast('カートに追加されました');
          this.closeModal();
          this.$router.push({ path: '/user' });
        } catch (error) {
          Toast('通信エラーが発生しました');
        } finally {
          Indicator.close();
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      goToPage(page) {
        this.currentPage = page;
      },
      changePerPage(value) {
        this.perPage = value;
        this.currentPage = 1; // 1ページ目に戻す
      },

      isFavorite(item) {
        return this.favorites.some(fav => fav.order_id === item.id);
      },

      async toggleFavorite(item) {

        if (this.isFavorite(item)) {
          // 既にお気に入り → 削除
          const fav = this.favorites.find(f => f.order_id === item.id);
          if (!fav) return;
          await deleteFavorite(fav.id);
          this.favorites = this.favorites.filter(f => f.id !== fav.id);
        } else {
          // まだお気に入りじゃない → 追加
          const res = await addToFavorite({
            user_id: this.userInfo.user_id,
            order_id: item.id,
            shopName: item.shopName,
            name: item.name,
            price: item.totalAmount,
            itemCount: item.itemCount,
          });
          this.favorites = [...this.favorites, res];
        }
      },
      async handleSearch(keyword) {
      },

      filteredOption(value) {
        this.selectedFilter = value;
      }
    },
  };

</script>

<style scoped>
  .orderlist_container {
    padding: 10px;
    background-color: #f8f8f8;
  }
  /* .search_container {
    margin-bottom: 16px;
    width: 100%;
  } */
  .search_controls {
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .search_input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    flex: 1;
    min-width: 120px;
    max-width: 200px;
  }
  .price_separator {
    font-size: 14px;
    color: #555;
  }
  .filter_select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .clear_button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .clear_button:hover {
    background: #f5f5f5;
  }
  .validation_errors {
    margin-top: 8px;
    min-height: 20px;
  }
  .error_message {
    color: #ff0000;
    font-size: 12px;
    margin: 4px 0;
  }
  .orderlist_container button.active {
    color: white;
    background-color: #ff4757;
    /* border: #ddd; */
    border-radius: 4px;
    cursor: pointer;
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
.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.pagination-controls button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}
.favorite-icon {
  color: #ccc;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  user-select: none;
  width: auto;
}
.favorite-icon:hover {
  color: #ff6b6b;
}
.favorite-icon.active {
  color: #ff4757;
}
</style>
