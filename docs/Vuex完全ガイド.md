# Vuex完全ガイド

## 📌 結論

**Vuex = storeディレクトリ = アプリ全体で共有されるグローバルな状態管理**

---

## 🔥 Vuexとは？

### 定義
- **アプリ全体で共有できるデータの保管庫（ストア）**
- どのコンポーネントからでもアクセス・更新できる
- ユーザー情報、カート内容、設定など「複数の画面で使うデータ」を管理する

### なぜ必要？
- propsで親→子に渡すと、階層が深くなると大変
- 複数のコンポーネントで同じデータを使いたい場合、Vuexにまとめると楽

---

## ⚡ Vuexの基本構造

### 1. **state（状態）**
- データそのもの
- 例：ユーザー情報、カート内容、カウント

```javascript
const state = () => ({
  count: 0,
  時間: ''
});
```

---

### 2. **mutations（変更）**
- stateを変更する唯一の方法
- 同期処理のみ（非同期処理は使えない）

```javascript
const mutations = {
  increment(state) {
    state.count++;
  }
};
```

---

### 3. **actions（アクション）**
- mutationsを呼び出す
- 非同期処理（API通信など）ができる

```javascript
const actions = {
  addCount({ commit }) {
    commit('increment');
  }
};
```

---

### 4. **getters（取得）**
- stateを取得する
- computedのようにリアクティブ（自動更新）

```javascript
const getters = {
  userInfo: state => state.userInfo
};
```

---

## 📖 このアプリでの実装

### store/index.js（メインストア）

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import userInfo from './userInfo.js';

Vue.use(Vuex) // Vuexをアプリ全体で使えるようにする

const store = () => new Vuex.Store({
  modules: {
    userInfo, // userInfo.jsをモジュールとして登録
  },
  state: () => ({
    count: 0,
    時間: ''
  }),
  mutations: {
    increment(state) { state.count++; }
  },
  actions: {
    addCount({ commit }) { commit('increment'); }
  }
})

export default store;
```

---

### store/userInfo.js（モジュール）

```javascript
export const state = () => ({
  userInfo: null
});

export const getters = {
  userInfo: state => state.userInfo
};

export const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  }
};

export const actions = {
  updateUserInfo({ commit }, userInfo) {
    commit('setUserInfo', userInfo);
  }
};
```

---

## 🔍 重要ポイント

### ポイント1：store/index.js は特別
- **index.js に直接書いた state, mutations, actions はグローバルで使える**
- 特にmodulesで登録しなくても使える

### ポイント2：他のファイルはmodulesで登録が必要
- **store/userInfo.js などは、index.js の modules で登録しないと使えない**

```javascript
const store = () => new Vuex.Store({
  modules: {
    userInfo, // ← これがないと userInfo は使えない
  }
})
```

### ポイント3：modulesで登録すると名前空間付きでアクセスできる
```javascript
// コンポーネント内
import { mapGetters } from 'vuex';

computed: {
  ...mapGetters('userInfo', ['userInfo']) // ← 'userInfo'が名前空間
}
```

---

## ✅ コンポーネントでの使い方

### 1. **state を取得する（mapGetters）**

```javascript
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('userInfo', ['userInfo'])
  }
}
```

→ `this.userInfo` で使える

---

### 2. **state を変更する（mapMutations）**

```javascript
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations('userInfo', ['setUserInfo'])
  },
  mounted() {
    this.setUserInfo({ name: '太郎', mobile: '08012345678' });
  }
}
```

---

### 3. **非同期処理を実行する（mapActions）**

```javascript
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('userInfo', ['updateUserInfo'])
  },
  async mounted() {
    await this.updateUserInfo({ name: '太郎' });
  }
}
```

---

## 🚀 実際の流れ（例：カート機能）

### 1. API通信でデータ取得
```javascript
// pages/cart.vue
async mounted() {
  let res = await cartItems(this.userInfo.user_id);
  this.cartItems = res;
}
```

### 2. データを表示
```vue
<template>
  <div v-for="item in cartItems" :key="item.id">
    {{ item.name }} - {{ item.price }}円
  </div>
</template>
```

### 3. データを更新
```javascript
methods: {
  addCount(item) {
    item.quantity++;
  }
}
```

---

## 💡 Vuexを使う場面 vs 使わない場面

### ✅ Vuexを使う場面
- ユーザー情報（複数の画面で使う）
- カート内容（複数の画面で使う）
- 認証状態（ログイン・ログアウト）
- 設定情報（テーマ、言語など）

### ❌ Vuexを使わない場面
- 1つのコンポーネントだけで使うデータ（data()で十分）
- 親子間でだけ使うデータ（propsで十分）

---

## 📊 まとめ

### Vuexの基本
- **store = Vuex = グローバルな状態管理**
- **storeディレクトリ内のファイルがVuex**

### store/index.js の役割
- Vuexをアプリ全体で使えるようにする（`Vue.use(Vuex)`）
- 他のモジュール（userInfo.jsなど）を登録する（`modules`）
- 直接書いた state, mutations, actions はグローバルで使える

### modulesの役割
- **index.js 以外のファイルは、modules で登録しないと使えない**
- 登録すると名前空間付きでアクセスできる（`mapGetters('userInfo', ['userInfo'])`）

### よく使う機能
- **mapGetters**：stateを取得する（computed）
- **mapMutations**：stateを変更する（methods）
- **mapActions**：非同期処理を実行する（methods）

---

## 🔥 このアプリの具体例

### store/index.js
```javascript
import userInfo from './userInfo.js';

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    userInfo, // ← userInfo.jsを登録
  },
  state: () => ({
    count: 0,
    時間: ''
  }),
  mutations: {
    increment(state) { state.count++; }
  },
  actions: {
    addCount({ commit }) { commit('increment'); }
  }
})
```

### コンポーネント（edit.vue）
```javascript
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('userInfo', ['userInfo']) // ← userInfoを取得
  },
  mounted() {
    console.log(this.userInfo); // { name: '太郎', mobile: '08012345678' }
  }
}
```

---

**Vuexは「アプリ全体で共有するデータの保管庫」です。  
import { mapGetters } from 'vuex' だけで、どこからでも簡単にアクセスできます！**
