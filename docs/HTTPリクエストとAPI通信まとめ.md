# HTTPリクエストとAPI通信まとめ

## 目次
1. [URLとクエリパラメータの基礎](#urlとクエリパラメータの基礎)
2. [GETリクエスト](#getリクエスト)
3. [POSTリクエスト](#postリクエスト)
4. [PUTリクエスト](#putリクエスト)
5. [DELETEリクエスト](#deleteリクエスト)
6. [params vs data の使い分け](#params-vs-data-の使い分け)
7. [実装例](#実装例)

---

## URLとクエリパラメータの基礎

### 普通のURL
```
http://localhost:3000/api/past
```
→ 「pastのデータ全部ください」

### クエリパラメータ付きURL
```
http://localhost:3000/api/past?user_id=1
                              ↑ これがクエリパラメータ
```
→ 「pastのデータで、user_id=1のやつだけください」

### クエリパラメータの構造
```
?user_id=1              // 単一の条件
?user_id=1&category=food // 複数の条件（&で繋ぐ）
?user_id=1&page=2&limit=10 // さらに複数
```

---

## GETリクエスト

### 用途
- データを**取得**する
- サーバーのデータを**変更しない**

### 特徴
- URLにクエリパラメータを付けてデータを絞り込む
- `params`を使う
- `data`は使わない（無視される）

### 書き方

#### パターン1: 全データを取得
```javascript
export const getAllPast = () => {
  return request({
    url: `/past`,
    method: 'GET'
    // params も data も不要
  })
}
```

実際のURL:
```
GET http://localhost:3000/api/past
```

#### パターン2: 条件を付けて取得
```javascript
export const getPastByUser = (user_id) => {
  return request({
    url: `/past`,
    method: 'GET',
    params: { user_id }  // ✅ クエリパラメータとして送る
  })
}
```

実際のURL:
```
GET http://localhost:3000/api/past?user_id=1
```

#### パターン3: 複数の条件
```javascript
export const searchFood = (user_id, category) => {
  return request({
    url: `/food`,
    method: 'GET',
    params: { 
      user_id,
      category
    }
  })
}
```

実際のURL:
```
GET http://localhost:3000/api/food?user_id=1&category=ramen
```

---

## POSTリクエスト

### 用途
- 新しいデータを**作成**する
- サーバーにデータを**送信**する

### 特徴
- リクエストボディ（body）にデータを含める
- `data`を使う
- `params`は基本使わない（使うこともあるが稀）

### 書き方

```javascript
export const createFood = (foodData) => {
  return request({
    url: `/food`,
    method: 'POST',
    data: foodData  // ✅ リクエストボディに含める
  })
}
```

実際のリクエスト:
```
POST http://localhost:3000/api/food

リクエストボディ:
{
  "user_id": 1,
  "name": "から揚げ",
  "rating": "4",
  "distance": "1,000m"
}
```

使い方:
```javascript
const newFood = {
  user_id: 1,
  name: "から揚げ",
  rating: "4",
  distance: "1,000m"
};

await createFood(newFood);
```

---

## PUTリクエスト

### 用途
- 既存のデータを**更新**する（全体を上書き）

### 特徴
- URLで更新対象を指定
- `data`で新しいデータを送る

### 書き方

```javascript
export const updateFood = (id, foodData) => {
  return request({
    url: `/food/${id}`,  // URLで対象を指定
    method: 'PUT',
    data: foodData  // ✅ 更新後のデータ
  })
}
```

実際のリクエスト:
```
PUT http://localhost:3000/api/food/1

リクエストボディ:
{
  "user_id": 1,
  "name": "特製から揚げ",  // 名前を変更
  "rating": "5",  // 評価を変更
  "distance": "1,000m"
}
```

使い方:
```javascript
const updatedFood = {
  user_id: 1,
  name: "特製から揚げ",
  rating: "5",
  distance: "1,000m"
};

await updateFood(1, updatedFood);  // id=1のデータを更新
```

---

## DELETEリクエスト

### 用途
- データを**削除**する

### 特徴
- URLで削除対象を指定
- `data`も`params`も基本不要

### 書き方

```javascript
export const deleteFood = (id) => {
  return request({
    url: `/food/${id}`,  // URLで削除対象を指定
    method: 'DELETE'
    // data も params も不要
  })
}
```

実際のリクエスト:
```
DELETE http://localhost:3000/api/food/1
```

使い方:
```javascript
await deleteFood(1);  // id=1のデータを削除
```

---

## params vs data の使い分け

### params（クエリパラメータ）

#### 使う場面
- **GETリクエスト**
- データを絞り込む時
- 検索条件を指定する時

#### 特徴
- URLに表示される
- ブラウザの履歴に残る
- ブックマークできる

#### 書き方
```javascript
params: { user_id: 1, category: 'food' }
```

#### 実際のURL
```
/food?user_id=1&category=food
```

---

### data（リクエストボディ）

#### 使う場面
- **POST/PUT/PATCHリクエスト**
- データを作成・更新する時
- 大量のデータを送る時

#### 特徴
- URLには表示されない
- リクエストのボディ（中身）として送られる
- セキュリティ的に安全（パスワードなど）

#### 書き方
```javascript
data: { 
  name: "から揚げ",
  price: 500,
  description: "美味しいから揚げ"
}
```

#### 実際のリクエスト
```
POST /food

{
  "name": "から揚げ",
  "price": 500,
  "description": "美味しいから揚げ"
}
```

---

### まとめ表

| HTTPメソッド | 用途 | 使うもの | URL例 |
|------------|------|---------|-------|
| **GET** | データ取得 | `params` | `/food?user_id=1` |
| **POST** | データ作成 | `data` | `/food` |
| **PUT** | データ更新（全体） | `data` | `/food/1` |
| **PATCH** | データ更新（一部） | `data` | `/food/1` |
| **DELETE** | データ削除 | なし | `/food/1` |

---

## 実装例

### 実際のコード（order.js）

```javascript
import request from "../utils/request";

// ✅ GET: 全データ取得
export const getAllFood = () => {
  return request({
    url: `/food`,
    method: 'GET'
  })
}

// ✅ GET: user_idで絞り込み
export const getFoodByUser = (user_id) => {
  return request({
    url: `/food`,
    method: 'GET',
    params: { user_id }
  })
}

// ✅ POST: 新しい注文を作成
export const createFood = (foodData) => {
  return request({
    url: `/food`,
    method: 'POST',
    data: foodData
  })
}

// ✅ PUT: 注文を更新
export const updateFood = (id, foodData) => {
  return request({
    url: `/food/${id}`,
    method: 'PUT',
    data: foodData
  })
}

// ✅ DELETE: 注文を削除
export const deleteFood = (id) => {
  return request({
    url: `/food/${id}`,
    method: 'DELETE'
  })
}
```

---

### コンポーネントでの使い方

```javascript
import { getFoodByUser, createFood, updateFood, deleteFood } from "~/assets/services/order";

export default {
  methods: {
    // データ取得
    async fetchData() {
      const userId = this.userInfo.user_id;
      let res = await getFoodByUser(userId);
      this.foodList = res;
    },

    // データ作成
    async addFood() {
      const newFood = {
        user_id: 1,
        name: "ラーメン",
        rating: "4.5",
        distance: "800m"
      };
      await createFood(newFood);
      this.fetchData();  // 再取得
    },

    // データ更新
    async editFood(id) {
      const updatedFood = {
        user_id: 1,
        name: "特製ラーメン",
        rating: "5",
        distance: "800m"
      };
      await updateFood(id, updatedFood);
      this.fetchData();  // 再取得
    },

    // データ削除
    async removeFood(id) {
      await deleteFood(id);
      this.fetchData();  // 再取得
    }
  }
}
```

---

## よくある間違い

### ❌ 間違い1: GETで data を使う
```javascript
export const food = (user_id) => {
  return request({
    url: `/food`,
    method: 'GET',
    data: { user_id }  // ❌ GETでdataは無視される
  })
}
```

**修正:**
```javascript
export const food = (user_id) => {
  return request({
    url: `/food`,
    method: 'GET',
    params: { user_id }  // ✅ paramsを使う
  })
}
```

---

### ❌ 間違い2: POSTで params を使う
```javascript
export const createFood = (foodData) => {
  return request({
    url: `/food`,
    method: 'POST',
    params: foodData  // ❌ POSTでparamsは使わない
  })
}
```

**修正:**
```javascript
export const createFood = (foodData) => {
  return request({
    url: `/food`,
    method: 'POST',
    data: foodData  // ✅ dataを使う
  })
}
```

---

### ❌ 間違い3: URLに直接データを埋め込む（非推奨）
```javascript
export const food = (user_id) => {
  return request({
    url: `/food?user_id=${user_id}`,  // ❌ 動くけど推奨されない
    method: 'GET'
  })
}
```

**修正:**
```javascript
export const food = (user_id) => {
  return request({
    url: `/food`,
    method: 'GET',
    params: { user_id }  // ✅ paramsで自動生成
  })
}
```

---

## 今回のやり取りまとめ

### 問題
```javascript
// 元のコード
export const past = (params) => {
  return request({
    url: `/past`,
    method: 'GET',
    data: params,  // ❌ GETでdataは無視される
  })
}
```

**結果:** `/past` で全データが返ってくる（paramsが無視されるから）

---

### 解決
```javascript
// 修正後
export const past = (user_id) => {
  return request({
    url: `/past`,
    method: 'GET',
    params: { user_id }  // ✅ クエリパラメータとして送る
  })
}
```

**結果:** `/past?user_id=1` で user_id=1 のデータだけが返ってくる

---

## 重要ポイント

1. **GET = `params`（URLに表示される）**
2. **POST/PUT/PATCH = `data`（ボディに含まれる）**
3. **DELETE = 何も付けない（URLで対象を指定）**
4. **全データ取得 = params も data も書かない**
5. **クエリパラメータ = `?key=value&key2=value2` の形式**

---

## 参考リンク

- [HTTP リクエストメソッド - MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods)
- [axios - GitHub](https://github.com/axios/axios)
- [RESTful API 設計ガイド](https://restfulapi.net/)
