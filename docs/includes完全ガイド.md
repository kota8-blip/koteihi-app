# `includes`メソッド完全ガイド

## 📌 概要

`includes`は、JavaScriptで**文字列や配列に特定の値が含まれているか**をチェックするメソッドです。

---

## 🔥 使える型

### 1️⃣ **文字列（String）**

特定の文字列が含まれているかをチェックできます。

```javascript
const text = "09012345678";
text.includes("090"); // true
text.includes("abc"); // false
```

---

### 2️⃣ **配列（Array）**

配列に特定の要素が含まれているかをチェックできます。

```javascript
const numbers = [1, 2, 3, 4, 5];
numbers.includes(3); // true
numbers.includes(10); // false
```

---

## ⚠️ エラーになる場合

### ❌ `undefined`や`null`に対して使うとエラー

`includes`は文字列や配列に対してのみ使えます。  
`undefined`や`null`に対して使うと**TypeError**が発生します。

#### 例（エラー）:
```javascript
let mobile;
mobile.includes("0"); 
// TypeError: Cannot read properties of undefined (reading 'includes')
```

```javascript
let mobile = null;
mobile.includes("0"); 
// TypeError: Cannot read properties of null (reading 'includes')
```

---

## ✅ 安全な使い方

### 1. **型チェックをしてから使う**

```javascript
const mobile = "09012345678";
if (typeof mobile === 'string' && mobile.includes('-')) {
  console.log("ハイフンが含まれています");
}
```

---

### 2. **値が存在するかチェックしてから使う**

```javascript
const mobile = "09012345678";
if (mobile && mobile.includes('-')) {
  console.log("ハイフンが含まれています");
} else {
  console.log("ハイフンは含まれていません");
}
```

---

### 3. **Optional Chaining（オプショナルチェイニング）を使う**

```javascript
const mobile = undefined;
const hasHyphen = mobile?.includes('-'); 
// エラーにならず、undefined が返る
```

---

## 📖 構文

### 文字列の場合

```javascript
string.includes(searchString, position)
```

- `searchString`：検索する文字列
- `position`（省略可）：検索を開始する位置（デフォルト: 0）

#### 例：
```javascript
const text = "Hello World";
text.includes("World");      // true
text.includes("World", 7);   // false（位置7以降に"World"がない）
```

---

### 配列の場合

```javascript
array.includes(valueToFind, fromIndex)
```

- `valueToFind`：検索する値
- `fromIndex`（省略可）：検索を開始するインデックス（デフォルト: 0）

#### 例：
```javascript
const numbers = [1, 2, 3, 4, 5];
numbers.includes(3);      // true
numbers.includes(3, 3);   // false（インデックス3以降に3がない）
```

---

## 🔍 返り値

- **`true`**：値が含まれている場合
- **`false`**：値が含まれていない場合

---

## 💡 実務での使用例

### 1. **バリデーション（ハイフンチェック）**

```javascript
static hasHyphen(mobile) {
  return typeof mobile === 'string' && mobile.includes('-');
}
```

---

### 2. **配列内の値チェック**

```javascript
const allowedRoles = ['admin', 'editor', 'viewer'];
const userRole = 'admin';

if (allowedRoles.includes(userRole)) {
  console.log("権限があります");
} else {
  console.log("権限がありません");
}
```

---

### 3. **文字列内の検索**

```javascript
const email = "test@example.com";

if (email.includes('@')) {
  console.log("正しいメールアドレス形式です");
} else {
  console.log("@が含まれていません");
}
```

---

## ⚡ 注意点

### 1. **大文字・小文字を区別する**

```javascript
const text = "Hello World";
text.includes("hello"); // false（大文字・小文字が違う）
```

→ 大文字・小文字を区別しない場合は、`toLowerCase()`を使う

```javascript
text.toLowerCase().includes("hello"); // true
```

---

### 2. **`undefined`や`null`に対して使うとエラー**

```javascript
let mobile;
mobile.includes("0"); // TypeError
```

→ 必ず型チェックや値の有無を確認してから使う

---

### 3. **IE11では使えない（ポリフィルが必要）**

`includes`はES2015（ES6）で追加されたメソッドなので、  
古いブラウザ（IE11など）では使えません。

→ Babelなどでトランスパイルするか、ポリフィルを使う

---

## 📊 他のメソッドとの比較

### `indexOf`との違い

- `indexOf`：値が見つかった位置を返す（見つからない場合は`-1`）
- `includes`：`true`/`false`を返す

```javascript
const text = "Hello World";

// indexOf
text.indexOf("World"); // 6（位置を返す）
text.indexOf("abc");   // -1（見つからない）

// includes
text.includes("World"); // true
text.includes("abc");   // false
```

---

### `find`との違い（配列）

- `find`：条件に一致する**最初の要素**を返す
- `includes`：値が含まれているかを**true/false**で返す

```javascript
const numbers = [1, 2, 3, 4, 5];

// find
numbers.find(num => num > 3); // 4（最初の条件一致要素）

// includes
numbers.includes(3); // true
```

---

## ✅ まとめ

### `includes`の特徴

- ✅ 文字列・配列で使える
- ✅ `true`/`false`を返す
- ✅ シンプルで分かりやすい
- ❌ `undefined`や`null`に対して使うとエラー
- ❌ 大文字・小文字を区別する

---

### 安全な使い方

```javascript
// 型チェック
if (typeof mobile === 'string' && mobile.includes('-')) {
  // 処理
}

// 値の有無チェック
if (mobile && mobile.includes('-')) {
  // 処理
}

// Optional Chaining
const hasHyphen = mobile?.includes('-');
```

---

**実務では、`includes`を使う前に必ず型チェックや値の有無を確認するのが基本です！**
