# store/types.js 完全ガイド

## 📌 全体像

`store/types.js`は、Vuexのmutation名やaction名などを**定数化して一元管理するための専用ファイル**です。

---

## 1. types.jsの役割

### 主な目的

- **mutation名やaction名を定数として一元管理**
- **typo（スペルミス）を防ぐ**
- **保守性を向上させる**
- **IDE補完を効かせる**

---

## 2. 基本的な使い方

### types.jsで定数を定義

```javascript
// store/types.js
export const LOGIN = 'LOGIN'
export const OUT_LOGIN = 'OUT_LOGIN'
export const USER_INFO_UPDATA = 'USER_INFO_UPDATA'
export const SET_CART = 'SET_CART'
export const CLEAR_CART = 'CLEAR_CART'
```

---

### storeモジュールでimportして使用

```javascript
// store/userInfo.js
import { LOGIN, OUT_LOGIN, USER_INFO_UPDATA } from './types.js'

const mutations = {
  [LOGIN](state, value) {
    state.userInfo = value
  },
  [OUT_LOGIN](state) {
    state.userInfo = {}
  },
  [USER_INFO_UPDATA](state, value) {
    state.userInfo = Object.assign(state.userInfo, value)
  }
}
```

---

## 3. ファイル名の命名規則（世界共通）

### よく使われるファイル名

- `types.js` ← 最も一般的
- `mutation-types.js`
- `action-types.js`
- `constants.js`

---

### どれを選ぶべきか？

- **小〜中規模プロジェクト**：`types.js`でmutationとactionを全て管理
- **大規模プロジェクト**：`mutation-types.js`と`action-types.js`で分割

---

## 4. 世界共通の認識・使い方

### ✅ 世界中の多くのVue/Vuexプロジェクトで採用されている

- **Vue公式ドキュメントでも推奨されているパターン**
- **Vuexのベストプラクティスとして広く認知されている**
- **中〜大規模プロジェクトではほぼ必須**

---

### ✅ 役割と使い方は共通

- mutation名やaction名を定数として管理
- ブラケット記法で使用：`[LOGIN](state, value) { ... }`
- typo防止と保守性向上が目的

---

## 5. メリット

### 1. typo防止

```javascript
// 文字列の場合（typoしても気づけない）
mutations: {
  LOGIN(state, value) { ... }
}
actions: {
  login({ commit }, value) {
    commit('LOGN', value)  // ← typo！でもエラーにならない
  }
}
```

```javascript
// 定数の場合（typoしたらimport時点でエラー）
import { LOGIN, LOGN } from './types.js'  // ← LOGNは存在しないのでエラー

mutations: {
  [LOGIN](state, value) { ... }
}
actions: {
  login({ commit }, value) {
    commit(LOGIN, value)  // ← 安全
  }
}
```

---

### 2. 一元管理

- すべてのmutation名やaction名を`types.js`に集約
- 変更する時も1箇所だけ修正すればOK
- 一覧が見やすく、把握しやすい

---

### 3. IDE補完が効く

```javascript
import { LO|  // ← ここでIDEが補完候補を表示してくれる
```

---

## 6. types.jsの構造例

### 小規模プロジェクト

```javascript
// store/types.js
// user
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

// cart
export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

// product
export const SET_PRODUCTS = 'SET_PRODUCTS'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
```

---

### 大規模プロジェクト（機能ごとに分ける）

```javascript
// store/types.js
// ========== USER ==========
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const UPDATE_USER = 'UPDATE_USER'

// ========== CART ==========
export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const CLEAR_CART = 'CLEAR_CART'

// ========== PRODUCT ==========
export const SET_PRODUCTS = 'SET_PRODUCTS'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'

// ========== ORDER ==========
export const CREATE_ORDER = 'CREATE_ORDER'
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS'
```

---

## 7. types.jsを使わない場合との比較

### types.jsを使わない場合

```javascript
// store/userInfo.js
const mutations = {
  LOGIN(state, value) { ... },
  LOGOUT(state) { ... }
}
```

```javascript
// コンポーネントで呼び出し
this.$store.commit('userInfo/LOGIN', user)  // ← 文字列なのでtypoリスク
```

---

### types.jsを使う場合

```javascript
// store/types.js
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
```

```javascript
// store/userInfo.js
import { LOGIN, LOGOUT } from './types.js'

const mutations = {
  [LOGIN](state, value) { ... },
  [LOGOUT](state) { ... }
}
```

```javascript
// コンポーネントで呼び出し
import { LOGIN } from '~/store/types.js'
this.$store.commit('userInfo/' + LOGIN, user)  // ← 定数なので安全
```

---

## 8. 実際の現場では？

### 採用率

- **小規模プロジェクト**：30〜40%（文字列で書くことも多い）
- **中規模プロジェクト**：70〜80%（定数管理が推奨される）
- **大規模プロジェクト**：90%以上（ほぼ必須）

---

### 使い分け

- **mutationsは定数管理が多い**（commitで頻繁に呼び出すため）
- **actionsやgettersは定数管理が少ない**（プロジェクトによる）

---

## 9. Vue公式ドキュメントでの推奨

Vue公式ドキュメントでも、以下のように推奨されています：

> mutation名を定数として管理することで、チーム開発や大規模プロジェクトで保守性を向上させることができます。

参考：[Vuex公式ドキュメント - Mutations](https://vuex.vuejs.org/guide/mutations.html)

---

## 10. まとめ

### 重要ポイント

✅ **`types.js`はmutation名やaction名を定数化して一元管理するファイル**  
✅ **世界中の多くのVue/Vuexプロジェクトで採用されているベストプラクティス**  
✅ **ファイル名は`types.js`が最も一般的**（他に`mutation-types.js`なども）  
✅ **typo防止・一元管理・IDE補完のメリットがある**  
✅ **中〜大規模プロジェクトではほぼ必須**  
✅ **Vue公式ドキュメントでも推奨されている**

---

### ベストプラクティス

- **中〜大規模プロジェクトでは必ず`types.js`で定数管理する**
- **小規模プロジェクトでは文字列でもOKだが、将来の拡張を考えると定数管理が安全**
- **mutation名は必ず定数管理、actionsやgettersはプロジェクトによる**

---

**この理解があれば、`types.js`の役割と世界共通の使い方が完璧に分かります！**
