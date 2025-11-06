# Vuexのnamespaced完全理解ガイド

## 📌 全体像

Vuexのstoreで状態管理をする際、**namespaced（名前空間）**を使うかどうかで、呼び出し方と安全性が大きく変わります。

---

## 1. storeの基本構造

### storeディレクトリの役割

```
store/
├── index.js        // グローバルstoreやモジュール登録
├── userInfo.js     // ユーザー情報モジュール
├── cart.js         // カートモジュール
└── product.js      // 商品モジュール
```

- **Nuxt.jsでは、storeディレクトリ直下にファイルを作ると自動的にVuexモジュールとして登録されます**
- ファイル名がモジュール名になる

---

## 2. namespacedとは？

**モジュールごとに独立した「名前空間」を作る設定です。**

```javascript
// store/userInfo.js
export default {
  namespaced: true,  // ← これを付けるかどうかが重要
  state: { userInfo: {} },
  actions: { login() {}, logout() {} },
  mutations: { SET_USER() {} },
  getters: { userInfo() {} }
}
```

---

## 3. namespaced: true の場合

### 呼び出し方

#### actions
```javascript
this.$store.dispatch("userInfo/login", user)
//                   ^^^^^^^^^^^^^^^^
//                   モジュール名/アクション名
```

#### mutations
```javascript
this.$store.commit("userInfo/SET_USER", user)
```

#### state
```javascript
this.$store.state.userInfo.userInfo
//                ^^^^^^^^
//                モジュール名
```

#### getters
```javascript
this.$store.getters["userInfo/userInfo"]
```

または、`mapGetters`を使う場合：
```javascript
import { mapGetters } from "vuex";

computed: {
  ...mapGetters("userInfo", ["userInfo"])
  //            ^^^^^^^^
  //            モジュール名を指定
}
```

---

### メリット

✅ **名前が衝突しない**  
複数のモジュールで同じaction名やmutation名を使っても、モジュール名で区別できる

✅ **安全に管理できる**  
どのモジュールのどのactionを呼んでいるか明確

✅ **大規模開発に最適**  
機能ごとにモジュールを分割しても、名前の衝突を気にせずに開発できる

---

## 4. namespaced なし の場合

### 呼び出し方

#### actions
```javascript
this.$store.dispatch("login", user)
//                   ^^^^^^
//                   アクション名だけ
```

#### mutations
```javascript
this.$store.commit("SET_USER", user)
```

#### state
```javascript
this.$store.state.userInfo.userInfo
```

#### getters
```javascript
this.$store.getters.userInfo
```

または、`mapGetters`を使う場合：
```javascript
import { mapGetters } from "vuex";

computed: {
  ...mapGetters(["userInfo"])
  //            モジュール名は不要
}
```

---

### デメリット

❌ **名前が衝突する危険がある**  
複数のモジュールで同じaction名やmutation名があると、**最後に登録されたものが優先される（上書きされる）**

❌ **エラーにならない**  
衝突しても静かに上書きされるだけなので、バグの原因になりやすい

❌ **大規模開発では危険**  
モジュールが増えると、どのactionが呼ばれているか分からなくなる

---

## 5. 衝突の具体例

### namespaced なし の場合（危険）

```javascript
// store/userInfo.js
export default {
  actions: {
    login({ commit }, user) {
      console.log("userInfo/login が呼ばれた");
      commit("SET_USER", user);
    }
  }
}

// store/admin.js
export default {
  actions: {
    login({ commit }, admin) {
      console.log("admin/login が呼ばれた");
      commit("SET_ADMIN", admin);
    }
  }
}
```

**呼び出し：**
```javascript
this.$store.dispatch("login", user);
// → 最後に登録された方（admin/login）が呼ばれる可能性がある
// → userInfo/login が呼ばれない！
```

---

### namespaced: true の場合（安全）

```javascript
// store/userInfo.js
export default {
  namespaced: true,
  actions: {
    login({ commit }, user) {
      console.log("userInfo/login が呼ばれた");
      commit("SET_USER", user);
    }
  }
}

// store/admin.js
export default {
  namespaced: true,
  actions: {
    login({ commit }, admin) {
      console.log("admin/login が呼ばれた");
      commit("SET_ADMIN", admin);
    }
  }
}
```

**呼び出し：**
```javascript
// ユーザーログイン
this.$store.dispatch("userInfo/login", user);
// → userInfo/login が確実に呼ばれる

// 管理者ログイン
this.$store.dispatch("admin/login", admin);
// → admin/login が確実に呼ばれる
```

---

## 6. グローバルstoreとモジュールの違い

### グローバルstore（store/index.js）

```javascript
// store/index.js
export default {
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    addCount({ commit }) {
      commit('increment')
    }
  }
}
```

**呼び出し：**
```javascript
this.$store.state.count
this.$store.dispatch("addCount")
```

**→ これはグローバルstoreなので、どこからでもアクセスできる**

---

### モジュール（store/userInfo.js）

```javascript
// store/userInfo.js
export default {
  namespaced: true,
  state: { userInfo: {} },
  actions: { login() {} }
}
```

**呼び出し：**
```javascript
this.$store.state.userInfo.userInfo
this.$store.dispatch("userInfo/login", user)
```

**→ これはモジュールなので、モジュール名を付けてアクセスする**

---

## 7. store/index.js でのモジュール登録

### Nuxt.jsの自動登録

Nuxt.jsでは、**storeディレクトリ直下のファイルが自動的にモジュールとして登録**されます。

```
store/
├── userInfo.js  // 自動的に userInfo モジュールとして登録
├── cart.js      // 自動的に cart モジュールとして登録
└── product.js   // 自動的に product モジュールとして登録
```

---

### 手動登録する場合

もし`store/modules/`のようなサブディレクトリを使いたい場合は、`store/index.js`で手動登録が必要です。

```javascript
// store/index.js
import Vuex from 'vuex'
import userInfo from './modules/userInfo'
import cart from './modules/cart'

const store = () => new Vuex.Store({
  modules: {
    userInfo,  // ← 手動で登録
    cart       // ← 手動で登録
  }
})

export default store
```

---

## 8. まとめ表

| 項目 | namespaced: true | namespacedなし |
|------|------------------|----------------|
| **呼び出し** | `dispatch("モジュール名/アクション名")` | `dispatch("アクション名")` |
| **安全性** | ◎ 衝突しない | × 衝突する危険 |
| **エラー検知** | ◎ 存在しないモジュール名でエラー | × 静かに上書きされる |
| **大規模開発** | ◎ 最適 | × 危険 |
| **小規模開発** | ◎ 推奨 | △ 問題ないが非推奨 |

---

## 9. ベストプラクティス

### ✅ 推奨：常に `namespaced: true` を使う

```javascript
// store/userInfo.js
export default {
  namespaced: true,  // ← 必ず付ける
  state: { userInfo: {} },
  actions: { login() {}, logout() {} },
  mutations: { SET_USER() {} },
  getters: { userInfo() {} }
}
```

### 理由

- 名前の衝突を完全に防げる
- 大規模開発でも安全
- どのモジュールのどのactionを呼んでいるか明確
- 他の開発者がコードを読む時も分かりやすい

---

## 10. 実際の使用例

### ログイン機能の実装

#### store/userInfo.js
```javascript
export default {
  namespaced: true,
  state: {
    userInfo: {}
  },
  actions: {
    login({ commit }, user) {
      commit("SET_USER", user);
    },
    logout({ commit }) {
      commit("CLEAR_USER");
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.userInfo = user;
    },
    CLEAR_USER(state) {
      state.userInfo = {};
    }
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    }
  }
}
```

#### pages/login.vue
```vue
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("userInfo", ["userInfo"])
  },
  methods: {
    async login() {
      const user = await loginApi({ mobile: this.mobile, password: this.password });
      
      // storeにユーザー情報を保存
      this.$store.dispatch("userInfo/login", user);
      
      // ユーザー詳細画面に遷移
      this.$router.push("/userdetail");
    }
  }
}
</script>
```

#### pages/userdetail.vue
```vue
<template>
  <div>
    <h2>{{ userInfo.name }}</h2>
    <p>電話番号: {{ userInfo.mobile }}</p>
    <p>メールアドレス: {{ userInfo.email }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("userInfo", ["userInfo"])
  }
}
</script>
```

---

## 11. よくある質問

### Q1. namespacedなしでも動くなら、なぜ付ける必要があるの？

**A.** 小規模開発では動きますが、規模が大きくなると名前が衝突して**バグの原因**になります。最初から`namespaced: true`を付けておけば、将来的に安全です。

---

### Q2. グローバルstoreとモジュールはどう使い分ける？

**A.**
- **グローバルstore（store/index.js）**：アプリ全体で使う共通の状態（例：ローディング、言語設定など）
- **モジュール（store/userInfo.jsなど）**：機能ごとの状態（例：ユーザー情報、カート、商品など）

---

### Q3. モジュールを登録しないとどうなる？

**A.** Vuexはそのモジュールを認識しないため、`[vuex] unknown action type: userInfo/login`のようなエラーが出ます。

---

### Q4. storeディレクトリにファイルを作るだけでグローバルになる？

**A.** Nuxt.jsでは、storeディレクトリ直下のファイルは自動的に**モジュール**として登録されます。ファイル名がモジュール名になります。

---

### Q5. store/index.jsとstore/userInfo.jsは何が違うの？

**A.**
- **store/index.js**：Vuexストア全体の「本体」。ここに書いたstateやactionsは**グローバルstore**として扱われる。
- **store/userInfo.js**：Vuexの「モジュール」。`namespaced: true`を付けることで、独立した名前空間で管理できる。

**重要：store/index.jsには`namespaced: true`は付与できません（そもそもグローバルなので不要）。**

---

### Q6. store/userInfo.jsもnamespacedを書かなければグローバルになる？

**A.** はい、その通りです！
- **namespacedなし** → グローバルstoreの一部として扱われる（衝突リスクあり）
- **namespaced: trueあり** → モジュールとして独立（安全・推奨）

---

### Q7. store/index.jsは危なくないの？どんな処理を置くべき？

**A.** グローバルstoreは便利ですが、乱用すると危険です。

**store/index.jsに置くべき処理：**
- アプリ全体で本当にグローバルな値だけ
  - 例：ローディング状態、テーマ設定、言語設定、通知メッセージなど

**モジュール（namespaced: true）に置くべき処理：**
- 機能ごとの状態管理
  - 例：ユーザー情報、カート、商品、注文履歴など

**ベストプラクティス：**
- **store/index.jsは最小限にする**
- **ほとんどのロジックはモジュール化する**
- **乱用すると名前の衝突や意図しない上書きが起きやすいので注意**

---

## 12. 重要ポイントまとめ

✅ **storeディレクトリにファイルを作る時は、必ず`namespaced: true`を付ける**  
✅ **呼び出し時は`this.$store.dispatch("モジュール名/アクション名")`**  
✅ **namespacedなしだと、名前が衝突して危険**  
✅ **グローバルstoreとモジュールを適切に使い分ける**  
✅ **Nuxt.jsは自動的にモジュールを登録してくれる**

---

## 13. 次のステップ

- 他の機能（カート、商品、お気に入りなど）もモジュール化して実装してみる
- `mapState`、`mapMutations`、`mapActions`の使い方を練習する
- localStorageと連携して、ページをリロードしても状態を保持する方法を学ぶ

---

**このガイドを参考に、Vuexの`namespaced`を完璧に理解して、安全にstateを管理しましょう！**
