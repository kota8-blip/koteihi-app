# Vuexのmutations定数管理とブラケット記法完全ガイド

## 📌 全体像

Vuexのmutationsやactionsなどを定義する際、**定数（シンボル）**を使うか**文字列**で直接書くかで、importの必要性や保守性が変わります。

---

## 1. mutations名の2つの書き方

### 方法1：文字列で直接書く（import不要）

```javascript
// store/userInfo.js
const mutations = {
  LOGIN(state, value) {
    state.userInfo = value;
  },
  LOGOUT(state) {
    state.userInfo = {};
  }
}
```

**呼び出し方：**
```javascript
this.$store.commit("userInfo/LOGIN", user);
```

---

### 方法2：定数（ブラケット記法）で書く（import必要）

```javascript
// store/types.js
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const USER_INFO_UPDATA = 'USER_INFO_UPDATA';
```

```javascript
// store/userInfo.js
import { LOGIN, LOGOUT } from './types.js';

const mutations = {
  [LOGIN](state, value) {  // ← ブラケット記法
    state.userInfo = value;
  },
  [LOGOUT](state) {
    state.userInfo = {};
  }
}
```

**呼び出し方：**
```javascript
import { LOGIN } from './store/types.js';
this.$store.commit("userInfo/" + LOGIN, user);

// または
this.$store.commit("userInfo/LOGIN", user);  // 文字列でもOK
```

---

## 2. ブラケット記法とは？

### 基本構文

```javascript
const KEY = 'login';

const obj = {
  [KEY]: function() { ... }  // ← 定数をプロパティ名として使う
}

// これは以下と同じ
const obj = {
  login: function() { ... }
}
```

---

### Vuexでの使用例

```javascript
import { LOGIN } from './types.js';

const mutations = {
  [LOGIN](state, value) { ... }
}

// これは以下と同じ
const mutations = {
  'LOGIN'(state, value) { ... }
}
```

---

## 3. なぜ定数管理（ブラケット記法）を使うのか？

### メリット1：typo（スペルミス）を防げる

**文字列の場合：**
```javascript
// actions
actions: {
  login({ commit }, value) {
    commit('LOGN', value);  // ← typo！でもエラーにならない
  }
}

// mutations
mutations: {
  LOGIN(state, value) { ... }
}
```
→ **mutation名が間違っているのに、エラーが出ない（静かに無視される）**

---

**定数の場合：**
```javascript
import { LOGIN, LOGN } from './types.js';  // ← LOGNは存在しないので即エラー

actions: {
  login({ commit }, value) {
    commit(LOGIN, value);  // ← 安全
  }
}
```
→ **importの時点でエラーになるので、typoに気づける**

---

### メリット2：一元管理できる

**すべてのmutation名を`types.js`に集約：**
```javascript
// store/types.js
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';
export const SET_CART = 'SET_CART';
export const CLEAR_CART = 'CLEAR_CART';
```

→ **mutation名の一覧が一目で分かる**  
→ **変更する時も1箇所だけ修正すればOK**

---

### メリット3：IDEの補完が効く

```javascript
import { LO|  // ← ここでIDEが補完候補を表示してくれる
```

→ **文字列だと補完が効かないが、定数なら補完が効く**

---

## 4. actionsやgettersはどうするの？

### actionsの場合

**定数管理はあまりしない（プロジェクトによる）**

```javascript
// 文字列で直接書くことが多い
actions: {
  login({ commit }, value) { ... },
  logout({ commit }) { ... }
}
```

**呼び出し方：**
```javascript
this.$store.dispatch("userInfo/login", user);
```

---

### gettersの場合

**定数管理はあまりしない（プロジェクトによる）**

```javascript
// 文字列で直接書くことが多い
getters: {
  userInfo(state) { return state.userInfo; },
  isLoggedIn(state) { return !!state.userInfo.user_id; }
}
```

**呼び出し方：**
```javascript
this.$store.getters["userInfo/userInfo"]
```

---

## 5. まとめ：何を定数管理すべきか？

| 種類 | 定数管理の頻度 | 理由 |
|------|---------------|------|
| **mutations** | ◎ 頻繁 | commitで呼び出す際にtypoが多い、一元管理したい |
| **actions** | △ たまに | dispatchで呼び出すが、actionsから直接呼ぶ頻度は低い |
| **getters** | × ほぼしない | 呼び出し頻度が低い、文字列で十分 |

---

## 6. 重要なポイント

### ❌ 間違った理解
- **「mutationsだからimportが必要」**  
  → これは間違い！

### ✅ 正しい理解
- **「定数（ブラケット記法）を使う場合にimportが必要」**  
  → mutationsでも文字列で書けばimport不要

---

## 7. 実際のコード例

### types.jsで定数を定義

```javascript
// store/types.js
export const LOGIN = 'LOGIN';
export const OUT_LOGIN = 'OUT_LOGIN';
export const USER_INFO_UPDATA = 'USER_INFO_UPDATA';
```

---

### userInfo.jsでimportして使用

```javascript
// store/userInfo.js
import cookies from "js-cookie";
import {
  LOGIN,
  OUT_LOGIN,
  USER_INFO_UPDATA
} from './types.js';

const state = {
  userInfo: {}
}

const actions = {
  login({ commit }, value) {
    commit(LOGIN, value);  // ← 定数を使用
  },
  outLogin({ commit }) {
    commit(OUT_LOGIN);
  },
  update({ commit }, value) {
    commit(USER_INFO_UPDATA, value);
  }
}

const mutations = {
  [LOGIN](state, value) {  // ← ブラケット記法
    cookies.set('userInfo', value);
    state.userInfo = value;
  },
  [OUT_LOGIN](state) {  // ← ブラケット記法
    cookies.remove('userInfo');
    state.userInfo = {};
  },
  [USER_INFO_UPDATA](state, value) {  // ← ブラケット記法
    state.userInfo = Object.assign(state.userInfo, value);
    cookies.set('userInfo', state.userInfo);
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
```

---

## 8. よくある質問

### Q1. 文字列で書くのとブラケット記法、どっちがいいの？

**A.**
- **小規模プロジェクト**：文字列で直接書いてもOK
- **中〜大規模プロジェクト**：ブラケット記法（定数管理）を推奨
- **理由**：typo防止、一元管理、IDEの補完が効く

---

### Q2. actionsやgettersも定数管理すべき？

**A.**
- **必須ではありません**
- mutationsは「commit」で頻繁に呼び出すのでtypoが多い → 定数管理が多い
- actionsやgettersは呼び出し頻度が低いので、文字列で書くことが多い

---

### Q3. ブラケット記法を使わないとエラーになる？

**A.**
- **いいえ、エラーにはなりません**
- 文字列で書けば問題なく動きます
- ブラケット記法は「typo防止・保守性向上」のためのベストプラクティスです

---

### Q4. types.jsに全てのmutation名を書く必要がある？

**A.**
- **必須ではありません**
- プロジェクトの規模や方針によります
- 小規模なら文字列で直接書いてもOK
- 大規模なら定数管理を推奨

---

## 9. ブラケット記法の他の使用例

### オブジェクトのプロパティ名を動的に決める

```javascript
const key = 'name';
const obj = {
  [key]: 'Taro'  // ← 定数をプロパティ名として使う
}

console.log(obj.name);  // 'Taro'
```

---

### 計算結果をプロパティ名にする

```javascript
const obj = {
  ['key_' + 1]: 'value1',
  ['key_' + 2]: 'value2'
}

console.log(obj.key_1);  // 'value1'
console.log(obj.key_2);  // 'value2'
```

---

## 10. 実際の開発での使い分け

### パターン1：小規模プロジェクト

```javascript
// 文字列で直接書く（シンプル）
const mutations = {
  LOGIN(state, value) { ... },
  LOGOUT(state) { ... }
}
```

---

### パターン2：中〜大規模プロジェクト

```javascript
// 定数管理（安全・保守性高い）
import { LOGIN, LOGOUT } from './types.js';

const mutations = {
  [LOGIN](state, value) { ... },
  [LOGOUT](state) { ... }
}
```

---

## 11. 【超重要】Vuexでエラーが表示されない仕様について

### Vuexの「静かに無視される」ルール

Vuexには「名前が間違っていてもエラーが表示されずに静かに無視される」という仕様があります。

---

### エラーが表示されない主なケース

#### 1. 存在しないmutation/action/getter名を呼んだ場合
```javascript
this.$store.commit('NOT_EXIST');    // エラー表示なし、何も起きない
this.$store.dispatch('NOT_EXIST');  // エラー表示なし、何も起きない
this.$store.getters['NOT_EXIST'];   // undefinedが返るだけ
```
**→ JavaScriptのエラーは出ない、Vuexが"静かに無視"する**

---

#### 2. mapState/mapGetters/mapActions/mapMutationsで存在しないものをマッピングした場合
```javascript
...mapGetters(['notExist'])  // [vuex] unknown getter: notExist という警告（console.warn）
```
**→ 警告は出るが、アプリは止まらない**

---

#### 3. モジュール名や名前空間が間違っている場合
```javascript
...mapGetters('wrongModule', ['userInfo'])  
// [vuex] module namespace not found in mapGetters(): wrongModule/ という警告
```
**→ 警告は出るが、アプリは止まらない**

---

### 重要：JavaScriptのエラーは普通に表示される

- **mutation/action/getterの「中身」で発生したJavaScriptエラーは、通常通り例外として表示されます**
    - 例：`state.userInfo.xxx()`でuserInfoがundefinedなら、TypeErrorが出る

---

### まとめ：Vuexのエラー表示ルール

| エラーの種類 | エラー表示 |
|------------|----------|
| **Vuexの呼び出し名・マッピング名が間違っている** | ❌ エラー表示なし or 警告のみ |
| **中身のJavaScript処理でエラー** | ✅ 普通にエラー表示される |

---

### だから定数管理が重要！

- **mutation名やaction名、getter名、モジュール名などを「定数化」しておけば、import時点でエラーになる**
- **文字列だとtypoしても静かに無視されるので、バグに気づきにくい**

---

## 12. 【応用】mapGetters・mapActions・モジュール名も定数化できる

### mutation以外も定数化すればtypo防止になる！

#### 例：モジュール名の定数化

```javascript
// store/types.js
export const MODULE_USERINFO = 'userInfo';
export const MODULE_CART = 'cart';
```

```javascript
// コンポーネントで使う
import { MODULE_USERINFO } from '~/store/types.js';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(MODULE_USERINFO, ['userInfo'])
  }
}
```

---

#### 例：getter名の定数化

```javascript
// store/types.js
export const GETTER_USER_INFO = 'userInfo';
export const GETTER_IS_LOGGED_IN = 'isLoggedIn';
```

```javascript
// コンポーネントで使う
import { MODULE_USERINFO, GETTER_USER_INFO } from '~/store/types.js';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(MODULE_USERINFO, [GETTER_USER_INFO])
  }
}
```

---

### メリット

- **typo防止**（import時点でエラーになる）
- **一元管理**（types.jsで全て管理できる）
- **IDE補完が効く**

---

### 実際の現場では？

- **mutations → 定数化が多い**（commitで頻繁に呼び出すため）
- **actions → 定数化は少ない**（プロジェクトによる）
- **getters → 定数化は少ない**（プロジェクトによる）
- **モジュール名 → 定数化はほとんどしない**（文字列で書くことが多い）

**ただし、大規模プロジェクトや安全性を重視する場合は、全て定数化することも可能！**

---

## 13. まとめ

### 重要ポイント

✅ **mutationsだからimportが必要なのではなく、「定数（ブラケット記法）を使う場合」にimportが必要**  
✅ **文字列で書けばimport不要**  
✅ **定数管理のメリット：typo防止、一元管理、IDEの補完**  
✅ **Vuexは「名前間違い」をエラー表示せず"静かに無視"する → だから定数化が重要**  
✅ **JavaScriptの処理エラーは普通にエラー表示される**  
✅ **mutations以外（actions、getters、モジュール名）も定数化できる**  
✅ **プロジェクトの規模や方針によって使い分ける**

---

### ベストプラクティス

- **中〜大規模プロジェクト → 定数管理（ブラケット記法）を推奨**
- **小規模プロジェクト → 文字列で書いてもOK**
- **迷ったら定数管理にしておけば、将来的に安全**
- **mutations以外も定数化すれば、さらに安全性が向上する**

---

**この理解があれば、Vuexのmutations管理を正しく・安全に行えます！**
