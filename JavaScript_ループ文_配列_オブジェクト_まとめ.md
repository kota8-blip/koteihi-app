# JavaScript ループ文 完全ガイド（配列 vs オブジェクト）

## 1. 配列専用のループ

配列に対してのみ使えるメソッド。オブジェクトには使えない。

### forEach（各要素を処理）

```javascript
const array = [1, 2, 3, 4, 5];

array.forEach(item => {
  console.log(item);  // 1, 2, 3, 4, 5
});
```

**特徴**: 返り値なし。副作用（console.logなど）のために使う。

---

### map（新しい配列を作る）

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]
```

**特徴**: 元の配列を変更せず、新しい配列を返す。

---

### filter（条件に合うものだけ抽出）

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers);  // [2, 4, 6]
```

**特徴**: 条件に合う要素だけを集めた新しい配列を返す。

---

### find（最初に見つかった1つを返す）

```javascript
const users = [
  { id: 1, name: "太郎" },
  { id: 2, name: "花子" },
  { id: 3, name: "次郎" }
];

const user = users.find(u => u.id === 2);
console.log(user);  // { id: 2, name: "花子" }
```

**特徴**: 条件に合う最初の要素を返す。見つからなければ `undefined`。

---

### some（1つでも条件を満たせばtrue）

```javascript
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven);  // true（2と4が偶数）
```

**特徴**: 1つでも条件を満たせば `true`、全て満たさなければ `false`。

---

### every（全て条件を満たせばtrue）

```javascript
const numbers = [2, 4, 6, 8];

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven);  // true（全て偶数）
```

**特徴**: 全ての要素が条件を満たせば `true`、1つでも満たさなければ `false`。

---

### reduce（1つの値に集約）

```javascript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);  // 15
```

**特徴**: 配列を1つの値にまとめる。合計、最大値、オブジェクト化など。

---

## 2. オブジェクト専用のループ

### for...in（キーを回す）

```javascript
const person = {
  name: "田中",
  age: 25,
  city: "東京"
};

for (let key in person) {
  console.log(key);          // "name", "age", "city"
  console.log(person[key]);  // "田中", 25, "東京"
}
```

**特徴**: オブジェクトのキー（プロパティ名）を1つずつ取り出す。

---

## 3. 両方使えるループ

### for...of（値を回す）

```javascript
// 配列の場合
const array = [10, 20, 30];
for (let value of array) {
  console.log(value);  // 10, 20, 30
}

// 文字列の場合
const str = "abc";
for (let char of str) {
  console.log(char);  // "a", "b", "c"
}
```

**注意**: オブジェクトには使えない（エラーになる）。

---

### 通常のforループ

```javascript
const array = [1, 2, 3, 4, 5];

for (let i = 0; i < array.length; i++) {
  console.log(array[i]);  // 1, 2, 3, 4, 5
}
```

**特徴**: インデックスを使って配列にアクセス。古典的だが最も柔軟。

---

## 4. 例外：オブジェクトを配列に変換してからループ

オブジェクトには `forEach` などが使えないため、一度配列に変換してからループする方法。

### Object.keys()（キーを配列にする）

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);  // → ["a", "b", "c"]

Object.keys(obj).forEach(key => {
  console.log(key);        // "a", "b", "c"
  console.log(obj[key]);   // 1, 2, 3
});
```

**仕様**: オブジェクトのキー（プロパティ名）を文字列の配列として返す。

---

### Object.values()（値を配列にする）

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.values(obj);  // → [1, 2, 3]

Object.values(obj).forEach(value => {
  console.log(value);  // 1, 2, 3
});
```

**仕様**: オブジェクトの値だけを配列として返す。

---

### Object.entries()（キーと値のペアを配列にする）

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.entries(obj);  // → [["a", 1], ["b", 2], ["c", 3]]

Object.entries(obj).forEach(([key, value]) => {
  console.log(key, value);  // "a" 1, "b" 2, "c" 3
});
```

**仕様**: `[キー, 値]` のペアを配列の配列として返す。

---

## 5. まとめ表

| メソッド/構文 | 配列 | オブジェクト | 説明 |
|--------------|------|-------------|------|
| `.forEach()` | ✅ | ❌ | 各要素を処理 |
| `.map()` | ✅ | ❌ | 新しい配列を作る |
| `.filter()` | ✅ | ❌ | 条件に合うものを抽出 |
| `.find()` | ✅ | ❌ | 最初の1つを返す |
| `.some()` | ✅ | ❌ | 1つでも条件を満たせばtrue |
| `.every()` | ✅ | ❌ | 全て条件を満たせばtrue |
| `.reduce()` | ✅ | ❌ | 1つの値に集約 |
| `for...in` | ⚠️ | ✅ | キーを回す |
| `for...of` | ✅ | ❌ | 値を回す |
| `for (;;)` | ✅ | ❌ | インデックスでアクセス |

---

## 6. 実践例

### 配列の例

```javascript
const goods = [
  {
    name: "热销榜",
    foods: [
      { name: "商品A", price: 10, count: 0 },
      { name: "商品B", price: 20, count: 2 }
    ]
  },
  {
    name: "优惠套餐",
    foods: [
      { name: "商品C", price: 30, count: 1 }
    ]
  }
];

// カートに入っている商品だけを抽出
let cartItems = [];
goods.forEach(category => {
  category.foods.forEach(food => {
    if (food.count > 0) {
      cartItems.push(food);
    }
  });
});

console.log(cartItems);
// [
//   { name: "商品B", price: 20, count: 2 },
//   { name: "商品C", price: 30, count: 1 }
// ]
```

---

### オブジェクトの例

```javascript
const user = {
  name: "田中",
  age: 25,
  city: "東京",
  email: "tanaka@example.com"
};

// for...in でキーと値を表示
for (let key in user) {
  console.log(`${key}: ${user[key]}`);
}
// name: 田中
// age: 25
// city: 東京
// email: tanaka@example.com

// Object.keys() で配列に変換してからfilter
const filteredKeys = Object.keys(user).filter(key => user[key].length > 5);
console.log(filteredKeys);  // ["email"]
```

---

## 7. よくある間違い

### ❌ オブジェクトに forEach を使う

```javascript
const obj = { a: 1, b: 2 };
obj.forEach(...)  // TypeError: obj.forEach is not a function
```

### ✅ 正しい方法

```javascript
// for...in を使う
for (let key in obj) {
  console.log(key, obj[key]);
}

// または Object.keys() で配列に変換
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

---

### ❌ 配列に for...in を使う

```javascript
const array = [10, 20, 30];
for (let key in array) {
  console.log(key);  // "0", "1", "2" （文字列のインデックス）
}
```

**問題**: インデックスが文字列で返ってくる。プロトタイプのプロパティも列挙される可能性がある。

### ✅ 正しい方法

```javascript
// forEach を使う
array.forEach(item => console.log(item));

// または for...of
for (let item of array) {
  console.log(item);
}
```

---

## 8. いつ何を使うべきか

### 配列を処理したい

- **各要素を処理**: `forEach()`
- **新しい配列を作る**: `map()`
- **条件で絞り込み**: `filter()`
- **1つだけ探す**: `find()`
- **合計などを計算**: `reduce()`

### オブジェクトを処理したい

- **キーと値を回す**: `for...in`
- **キーだけ欲しい**: `Object.keys()`
- **値だけ欲しい**: `Object.values()`
- **両方欲しい**: `Object.entries()`

---

## 9. Object.keys() の詳細仕様

### 基本

```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj);  // → ["a", "b", "c"]
```

**返り値**: オブジェクトの列挙可能なプロパティ名（キー）の配列

---

### 実用例

```javascript
const settings = {
  theme: "dark",
  language: "ja",
  notifications: true
};

// キーの数を数える
console.log(Object.keys(settings).length);  // 3

// 全てのキーを大文字に変換
const upperKeys = Object.keys(settings).map(key => key.toUpperCase());
console.log(upperKeys);  // ["THEME", "LANGUAGE", "NOTIFICATIONS"]

// 特定のキーが存在するかチェック
const hasTheme = Object.keys(settings).includes("theme");
console.log(hasTheme);  // true
```

---

### なぜ配列に変換するのか？

**理由**: オブジェクトには `forEach`, `map`, `filter` などの便利なメソッドがないから。

```javascript
const obj = { a: 1, b: 2, c: 3 };

// ❌ これはエラー
obj.map(...)     // obj.map is not a function
obj.filter(...)  // obj.filter is not a function

// ✅ 配列に変換すれば使える
Object.keys(obj).map(key => key.toUpperCase());
Object.keys(obj).filter(key => obj[key] > 1);
```

---

## まとめ

- **配列専用**: `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`
- **オブジェクト専用**: `for...in`
- **例外**: `Object.keys()`, `Object.values()`, `Object.entries()` でオブジェクトを配列に変換してから処理

**重要**: コードで `.forEach()` が使われていたら、その変数は**必ず配列**。
