# async/await完全ガイド

## 目次
1. [async/awaitとは](#asyncawaitとは)
2. [なぜ必要なのか](#なぜ必要なのか)
3. [基本的な使い方](#基本的な使い方)
4. [実際の例（API呼び出し）](#実際の例api呼び出し)
5. [よくある間違い](#よくある間違い)
6. [エラーハンドリング](#エラーハンドリング)
7. [複数のAPI呼び出し](#複数のapi呼び出し)

---

## async/awaitとは

### 簡単に言うと

**「時間がかかる処理が終わるまで待つ」ための仕組み**

---

### キーワードの意味

#### `async`
- 「この関数は非同期処理を使いますよ」という宣言
- 関数の前に付ける
- これがないと`await`が使えない

#### `await`
- 「この処理が終わるまで待つ」という命令
- 結果が返ってくるまで次の行に進まない
- `async`関数の中でしか使えない

---

## なぜ必要なのか

### 問題: 非同期処理は時間がかかる

````javascript
// API呼び出しは時間がかかる
let res = past(this.userInfo.user_id);
console.log(res);  // ❌ まだデータが返ってない
````

**結果:**
````
Promise { <pending> }  // 「まだ処理中です」という意味
````

---

### 解決: awaitで待つ

````javascript
// awaitで待つ
let res = await past(this.userInfo.user_id);
console.log(res);  // ✅ データが入ってる
````

**結果:**
````javascript
[
  { id: 1, title: "過去のイベント 1", name: "popeyes" },
  { id: 2, title: "過去のイベント 2", name: "burgerking" }
]
````

---

## 基本的な使い方

### パターン1: API呼び出し

````javascript
export default {
  methods: {
    async initData() {  // ← async を付ける
      // awaitで結果が返るまで待つ
      let res = await past(this.userInfo.user_id);
      
      // ← この時点でデータが入ってる
      console.log(res);  // [{ id: 1, ... }]
    }
  }
}
````

---

### パターン2: mounted()で使う

````javascript
export default {
  async mounted() {  // ← async を付ける
    // データ取得が終わってから次の処理
    let res = await past(this.userInfo.user_id);
    this.discoverListArr = [...res];
    
    console.log('データ取得完了！');
  }
}
````

---

### パターン3: ボタンクリック時

````javascript
export default {
  methods: {
    async handleClick() {  // ← async を付ける
      // クリックしたらデータ取得
      let res = await food(this.userInfo.user_id);
      this.foodList = [...res];
      
      alert('データ取得完了！');
    }
  }
}
````

---

## 実際の例（API呼び出し）

### 全体の流れ

````javascript
// 1. discover.js（API定義）
export const past = (user_id) => {
  return request({
    url: `/past`,
    method: 'GET',
    params: { user_id }
  })
}

// 2. discoverList.vue（コンポーネント）
import { past } from "~/assets/services/discover";

export default {
  data() {
    return {
      discoverListArr: []
    }
  },
  async mounted() {  // ← async を付ける
    // 3. API呼び出し（awaitで待つ）
    let res = await past(this.userInfo.user_id);
    
    // 4. データが返ってきた後の処理
    if (res && Array.isArray(res)) {
      this.discoverListArr = [...res];
    }
  }
}
````

---

### 実行の流れ（時系列）

````
1. mounted()が実行される
   ↓
2. await past(...) でAPI呼び出し
   ↓
3. サーバーにリクエスト送信
   ↓
4. 【待機中...】（この間、他の処理は止まる）
   ↓
5. サーバーからレスポンス受信
   ↓
6. res にデータが入る
   ↓
7. if文でチェック
   ↓
8. discoverListArr にデータを格納
   ↓
9. 画面に表示
````

---

## よくある間違い

### ❌ 間違い1: asyncを付け忘れ

````javascript
export default {
  methods: {
    initData() {  // ❌ asyncがない
      let res = await past(this.userInfo.user_id);  // ← エラー
    }
  }
}
````

**エラーメッセージ:**
````
Uncaught SyntaxError: await is only valid in async functions
````

**修正:**
````javascript
async initData() {  // ✅ asyncを付ける
  let res = await past(this.userInfo.user_id);
}
````

---

### ❌ 間違い2: awaitを付け忘れ

````javascript
async initData() {
  let res = past(this.userInfo.user_id);  // ❌ awaitがない
  console.log(res);  // Promise { <pending> }
}
````

**問題:**
- データが返ってくる前に次の行に進む
- `res`には`Promise`オブジェクトが入る（データではない）

**修正:**
````javascript
async initData() {
  let res = await past(this.userInfo.user_id);  // ✅ awaitを付ける
  console.log(res);  // [{ id: 1, ... }]
}
````

---

### ❌ 間違い3: 順番を間違える

````javascript
async initData() {
  console.log(this.discoverListArr);  // ← まだ空
  
  let res = await past(this.userInfo.user_id);
  this.discoverListArr = [...res];
  
  console.log(this.discoverListArr);  // ← データが入ってる
}
````

**注意:**
- `await`の**前**にアクセスすると、まだデータがない
- `await`の**後**にアクセスすると、データが入ってる

---

## エラーハンドリング

### パターン1: try/catch

````javascript
async initData() {
  try {
    let res = await past(this.userInfo.user_id);
    this.discoverListArr = [...res];
  } catch (error) {
    console.error('エラー発生:', error);
    alert('データ取得に失敗しました');
  }
}
````

---

### パターン2: if文でチェック

````javascript
async initData() {
  let res = await past(this.userInfo.user_id);
  
  if (res && Array.isArray(res)) {
    this.discoverListArr = [...res];
  } else {
    console.error('データが空です');
  }
}
````

---

### パターン3: ローディング表示

````javascript
export default {
  data() {
    return {
      loading: false,
      discoverListArr: []
    }
  },
  methods: {
    async initData() {
      this.loading = true;  // ローディング開始
      
      try {
        let res = await past(this.userInfo.user_id);
        this.discoverListArr = [...res];
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;  // ローディング終了
      }
    }
  }
}
````

````vue
<template>
  <div>
    <p v-if="loading">読み込み中...</p>
    <ul v-else>
      <li v-for="item in discoverListArr" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
````

---

## 複数のAPI呼び出し

### パターン1: 順番に実行（直列）

````javascript
async initData() {
  // 1つ目を取得
  let food = await getFood();
  console.log('food取得完了');
  
  // 2つ目を取得（1つ目が終わってから）
  let past = await getPast();
  console.log('past取得完了');
  
  // 合計時間 = food取得時間 + past取得時間
}
````

**実行時間:**
- foodが1秒、pastが1秒 → **合計2秒**

---

### パターン2: 並列実行

````javascript
async initData() {
  // 同時に開始
  let [food, past] = await Promise.all([
    getFood(),
    getPast()
  ]);
  
  console.log('両方取得完了');
  
  // 合計時間 = max(food取得時間, past取得時間)
}
````

**実行時間:**
- foodが1秒、pastが1秒 → **合計1秒**（同時実行）

---

### パターン3: どちらか早い方

````javascript
async initData() {
  // どちらか早く返ってきた方を使う
  let result = await Promise.race([
    getFood(),
    getPast()
  ]);
  
  console.log('早い方:', result);
}
````

---

## 実践例: orderList.vueの完全版

````javascript
<template>
  <div class="orderlist_container">
    <h2>注文履歴</h2>
    
    <!-- ローディング表示 -->
    <p v-if="loading">読み込み中...</p>
    
    <!-- エラー表示 -->
    <p v-else-if="error">{{ error }}</p>
    
    <!-- データ表示 -->
    <ul v-else-if="orderListArr.length">
      <li
        v-for="item in orderListArr"
        :key="item.id"
        class="order_li"
      >
        {{ item.name }} - {{ item.rating }}
      </li>
    </ul>
    
    <!-- データなし -->
    <p v-else>注文履歴がありません</p>
  </div>
</template>

<script>
import { food } from "~/assets/services/order";
import { mapGetters } from "vuex";

export default {
  name: 'OrderList',
  data() {
    return {
      orderListArr: [],
      loading: false,
      error: null
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
      // ローディング開始
      this.loading = true;
      this.error = null;
      
      try {
        // API呼び出し（awaitで待つ）
        let res = await food(this.userInfo.user_id);
        
        // データチェック
        if (res && Array.isArray(res)) {
          this.orderListArr = [...res];
        } else {
          this.error = 'データの形式が不正です';
        }
      } catch (err) {
        // エラーハンドリング
        console.error('API呼び出しエラー:', err);
        this.error = 'データ取得に失敗しました';
      } finally {
        // ローディング終了（成功・失敗に関わらず実行）
        this.loading = false;
      }
    },
    
    // リロードボタン用
    async reload() {
      await this.initData();
    }
  }
}
</script>
````

---

## async/awaitの仕組み（詳細）

### Promiseとの関係

````javascript
// これは同じ意味
// パターン1: async/await
async function getData() {
  let res = await past(1);
  return res;
}

// パターン2: Promise
function getData() {
  return past(1).then(res => {
    return res;
  });
}
````

**async/awaitは、Promiseを分かりやすく書くための構文**

---

### async関数は常にPromiseを返す

````javascript
async function test() {
  return 'Hello';
}

let result = test();
console.log(result);  // Promise { 'Hello' }

// awaitで取り出す
let value = await test();
console.log(value);  // 'Hello'
````

---

## まとめ

### 重要ポイント

1. **`async`を付けないと`await`は使えない**
2. **`await`を付けないとデータが取れない**
3. **`await`の前にアクセスしてもデータはまだない**
4. **エラーハンドリングは`try/catch`で**
5. **複数のAPI呼び出しは`Promise.all`で並列実行できる**

---

### 基本パターン（これだけ覚える）

````javascript
export default {
  async mounted() {  // ← async
    let res = await apiCall();  // ← await
    this.data = res;
  },
  
  methods: {
    async fetchData() {  // ← async
      try {
        let res = await apiCall();  // ← await
        this.data = res;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
````

---

### よくある使用例

````javascript
// ✅ API呼び出し
async mounted() {
  let res = await food(this.userInfo.user_id);
  this.foodList = [...res];
}

// ✅ ボタンクリック
async handleClick() {
  let res = await createFood(this.newFood);
  alert('作成完了！');
}

// ✅ 複数のAPI
async loadAll() {
  let [food, past] = await Promise.all([
    getFood(),
    getPast()
  ]);
  this.foodList = food;
  this.pastList = past;
}

// ✅ エラーハンドリング
async fetchData() {
  try {
    let res = await apiCall();
    this.data = res;
  } catch (error) {
    alert('エラーが発生しました');
  }
}
````

---

## 参考リンク

- [async function - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await)
- [Promise - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)
