# JavaScript 日付関連の関数まとめ

## 1. new Date() の基本

### 日付オブジェクトの作成

```javascript
// 現在の日時
const now = new Date();
console.log(now); // 例: 2025-11-24T12:34:56.789Z

// 文字列から日付を作成
const date1 = new Date("2025-11-24");
console.log(date1); // 2025年11月24日

// 年月日を指定して作成（月は0始まり）
const date2 = new Date(2025, 10, 24); // 2025年11月24日
```

---

## 2. Dateオブジェクトの引き算

### 重要な仕様

**Dateオブジェクト同士を引き算すると、ミリ秒単位の差が返る**

```javascript
const date1 = new Date("2025-11-24");
const date2 = new Date("2025-11-20");

const diff = date1 - date2;
console.log(diff); // 345600000（ミリ秒）= 4日分
```

### 具体例

```javascript
// 例1: 日付の差を計算
const orderDate1 = new Date("2025-11-24");
const orderDate2 = new Date("2025-11-20");

console.log(orderDate1 - orderDate2); // 345600000（正の値 = orderDate1が未来）
console.log(orderDate2 - orderDate1); // -345600000（負の値 = orderDate2が過去）
```

---

## 3. sortでの日付並び替え

### sortのコールバック関数の仕様

**`Array.prototype.sort(callback)`のルール：**
- コールバックが**負の値**を返す → `a`が`b`より前
- コールバックが**正の値**を返す → `b`が`a`より前
- コールバックが**0**を返す → 順序変わらず

### 昇順（古い順）

```javascript
const orders = [
  { orderDate: "2025-11-24" },
  { orderDate: "2025-11-20" },
  { orderDate: "2025-11-22" }
];

orders.sort((a, b) => {
  return new Date(a.orderDate) - new Date(b.orderDate);
});

// 結果: 20日 → 22日 → 24日（古い順）
```

**理屈：**
- `new Date(a.orderDate) - new Date(b.orderDate)`が負の値 → aが前（古い日付が前）
- 正の値 → bが前

### 降順（新しい順）

```javascript
orders.sort((a, b) => {
  return new Date(b.orderDate) - new Date(a.orderDate);
});

// 結果: 24日 → 22日 → 20日（新しい順）
```

または、符号を反転させる：

```javascript
orders.sort((a, b) => {
  const diff = new Date(a.orderDate) - new Date(b.orderDate);
  return -diff; // 符号を反転 = 降順
});
```

---

## 4. 昇順・降順の切り替え

### よくあるパターン

```javascript
const sortOrder = 'desc'; // 'desc'なら降順、'asc'なら昇順

orders.sort((a, b) => {
  const diff = new Date(a.orderDate) - new Date(b.orderDate);
  return sortOrder === 'desc' ? -diff : diff;
});
```

**理屈：**
- `sortOrder === 'desc'`なら`-diff`（符号反転 = 降順）
- それ以外なら`diff`（そのまま = 昇順）

---

## 5. 実用的な並び替え関数の例

### Vue.jsでの実装例

```javascript
data() {
  return {
    orderListArr: [],
    sortOrder: 'desc' // 'desc' or 'asc'
  }
},
methods: {
  toggleSortOrder() {
    // 並び順を切り替え
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    
    // 配列を並び替え
    this.orderListArr = [...this.orderListArr].sort((a, b) => {
      const diff = new Date(a.orderDate) - new Date(b.orderDate);
      return this.sortOrder === 'desc' ? -diff : diff;
    });
  }
}
```

---

## 6. 重要ポイントまとめ

### ポイント1: Dateオブジェクトの引き算
- `new Date(a) - new Date(b)` = ミリ秒単位の差
- 未来 - 過去 = 正の値
- 過去 - 未来 = 負の値

### ポイント2: sortのルール
- 負の値 → aが前
- 正の値 → bが前
- 0 → 順序変わらず

### ポイント3: 昇順・降順の切り替え
- 昇順：`new Date(a) - new Date(b)`
- 降順：`new Date(b) - new Date(a)` または `-diff`

### ポイント4: リアクティブな並び替え
- Vueでは`this.orderListArr = [...this.orderListArr].sort(...)`のように新しい配列を代入しないとリアクティブに反映されない

---

## 7. よくあるミス

### ミス1: sortで元の配列が変わらない

```javascript
// ❌ ダメな例（Vueでリアクティブに反映されない）
this.orderListArr.sort((a, b) => ...);

// ✅ 良い例（新しい配列を代入）
this.orderListArr = [...this.orderListArr].sort((a, b) => ...);
```

### ミス2: 日付の文字列をそのまま比較

```javascript
// ❌ ダメな例（文字列比較になる）
orders.sort((a, b) => a.orderDate - b.orderDate);

// ✅ 良い例（Dateオブジェクトに変換）
orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
```

### ミス3: sortのコールバックで何も返さない

```javascript
// ❌ ダメな例（returnがない = 並び替えされない）
orders.sort((a, b) => {
  new Date(a.orderDate) - new Date(b.orderDate);
});

// ✅ 良い例（returnで値を返す）
orders.sort((a, b) => {
  return new Date(a.orderDate) - new Date(b.orderDate);
});
```

---

## 8. 補足: 日付のフォーマット

### toLocaleDateString（日本語表示）

```javascript
const date = new Date("2025-11-24");
console.log(date.toLocaleDateString('ja-JP')); // "2025/11/24"
```

### getFullYear, getMonth, getDate

```javascript
const date = new Date("2025-11-24");
console.log(date.getFullYear()); // 2025
console.log(date.getMonth());    // 10（11月 = 10, 月は0始まり）
console.log(date.getDate());     // 24
```

---

このまとめで、日付関連の関数の仕様とsortでの並び替え方法が理解できます！
