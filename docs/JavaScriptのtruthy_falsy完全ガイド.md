# JavaScriptのtruthy・falsy完全ガイド

## 📌 全体像

JavaScriptでは、`if`文や`v-if`などの条件式で、値が「真（true）」か「偽（false）」として扱われます。  
この時、**実際に`true`/`false`でなくても、真偽値として評価される**のが「truthy」と「falsy」です。

---

## 1. Falsy（偽と判定される値）

JavaScriptでは、**以下の6つの値だけ**が`false`として扱われます。

| 値 | 型 | 説明 |
|----|----|----|
| `false` | Boolean | 真偽値の偽 |
| `0` | Number | 数値のゼロ |
| `""` | String | 空文字列 |
| `null` | Null | 値が存在しない |
| `undefined` | Undefined | 未定義 |
| `NaN` | Number | Not a Number（数値ではない） |

---

## 2. Truthy（真と判定される値）

**上記6つ以外は全て`true`として扱われます。**

### 特に注意すべきTruthy値

| 値 | 型 | 説明 |
|----|----|----|
| `{}` | Object | **空オブジェクトでもtrue** |
| `[]` | Array | **空配列でもtrue** |
| `"0"` | String | 文字列のゼロ（空文字列ではない） |
| `"false"` | String | 文字列のfalse（Boolean型ではない） |
| `1`, `-1` | Number | 0以外の数値 |
| `" "` | String | スペースだけでも空文字列ではない |
| `function(){}` | Function | 関数 |

---

## 3. 実際のコード例での挙動

### あなたのorder.vueの例

**ログインしていない時：**
```javascript
userInfo = {} // 空オブジェクト
```

#### パターン1：`v-if="!userInfo || !userInfo.mobile"`

```javascript
!userInfo || !userInfo.mobile
= !{} || !undefined
= false || true  // {}はtruthy、undefinedはfalsy
= true ✅ 表示される
```

#### パターン2：`v-if="!userInfo && !userInfo.mobile"`

```javascript
!userInfo && !userInfo.mobile
= !{} && !undefined
= false && true  // {}はtruthy、undefinedはfalsy
= false ❌ 表示されない
```

---

## 4. `||`（OR）と`&&`（AND）の違い

### `||`（OR：または）

- **どちらか一方でも`true`なら`true`**
- 左側が`true`なら右側は評価しない（短絡評価）

| 左 | 右 | 結果 |
|----|----|----|
| `true` | `true` | `true` |
| `true` | `false` | `true` |
| `false` | `true` | `true` |
| `false` | `false` | `false` |

---

### `&&`（AND：かつ）

- **両方が`true`の時だけ`true`**
- 左側が`false`なら右側は評価しない（短絡評価）

| 左 | 右 | 結果 |
|----|----|----|
| `true` | `true` | `true` |
| `true` | `false` | `false` |
| `false` | `true` | `false` |
| `false` | `false` | `false` |

---

## 5. よくある間違いと正しい書き方

### ❌ 間違い1：空オブジェクトや空配列をfalsyだと思い込む

```javascript
const obj = {};
if (!obj) {
  console.log("objは空"); // ← 実行されない！
}
```
**理由：`{}`はtruthyなので、`!{}`は`false`になる**

---

### ✅ 正しい書き方

```javascript
const obj = {};
if (Object.keys(obj).length === 0) {
  console.log("objは空"); // ← 実行される
}
```

---

### ❌ 間違い2：`"0"`や`"false"`をfalsyだと思い込む

```javascript
const str = "0";
if (!str) {
  console.log("strは偽"); // ← 実行されない！
}
```
**理由：`"0"`はtruthyなので、`!"0"`は`false`になる**

---

### ✅ 正しい書き方

```javascript
const str = "0";
if (str === "0") {
  console.log("strは0"); // ← 実行される
}
```

---

## 6. Truthy・Falsyの判定結果一覧表

| 値 | 型 | truthy or falsy | `!値`の結果 | `!!値`の結果 |
|----|----|--------------------|-------------|--------------|
| `false` | Boolean | falsy | `true` | `false` |
| `0` | Number | falsy | `true` | `false` |
| `""` | String | falsy | `true` | `false` |
| `null` | Null | falsy | `true` | `false` |
| `undefined` | Undefined | falsy | `true` | `false` |
| `NaN` | Number | falsy | `true` | `false` |
| `{}` | Object | **truthy** | **`false`** | **`true`** |
| `[]` | Array | **truthy** | **`false`** | **`true`** |
| `"0"` | String | **truthy** | **`false`** | **`true`** |
| `"false"` | String | **truthy** | **`false`** | **`true`** |
| `1` | Number | **truthy** | **`false`** | **`true`** |
| `-1` | Number | **truthy** | **`false`** | **`true`** |
| `" "` | String | **truthy** | **`false`** | **`true`** |
| `function(){}` | Function | **truthy** | **`false`** | **`true`** |

---

## 7. 実務でのベストプラクティス

### 1. 空オブジェクトや空配列のチェック

```javascript
// 空オブジェクトのチェック
if (Object.keys(obj).length === 0) { ... }

// 空配列のチェック
if (arr.length === 0) { ... }
```

---

### 2. 存在チェックは`undefined`や`null`を明示的に判定

```javascript
// ❌ 間違い
if (!userInfo.mobile) { ... } // 0や空文字列もfalseになる

// ✅ 正しい
if (userInfo.mobile === undefined || userInfo.mobile === null) { ... }

// ✅ より簡潔
if (userInfo.mobile == null) { ... } // nullとundefinedの両方にマッチ
```

---

### 3. デフォルト値の設定

```javascript
// ❌ 間違い（0や空文字列でもデフォルト値になる）
const value = userInput || 'default';

// ✅ 正しい（null/undefinedの時だけデフォルト値）
const value = userInput ?? 'default'; // Nullish coalescing operator
```

---

## 8. まとめ

### 重要ポイント

✅ **Falsyは6つだけ：`false`, `0`, `""`, `null`, `undefined`, `NaN`**  
✅ **それ以外は全てTruthy（空オブジェクト`{}`や空配列`[]`もtrue）**  
✅ **`||`（OR）は「どちらか一方でも真なら真」**  
✅ **`&&`（AND）は「両方が真でないと真にならない」**  
✅ **空オブジェクトや空配列をチェックする時は`Object.keys()`や`length`を使う**  
✅ **デフォルト値の設定には`??`（Nullish coalescing）を使う**

---

### ワンポイント

**`!!値`で明示的にBoolean型に変換できます：**
```javascript
!!{}        // true
!![]        // true
!!0         // false
!!""        // false
!!null      // false
!!undefined // false
```

---

**この理解があれば、JavaScriptの条件分岐で迷うことはありません！**
