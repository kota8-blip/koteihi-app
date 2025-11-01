# JavaScript の Export/Import 完全ガイド

## 1. 名前付きエクスポート (Named Export)

### エクスポート側
```javascript
// shopping.js
export const seller = (params) => { ... }
export const goods = (params) => { ... }
export const ratings = (params) => { ... }
```

### インポート側（3つのパターン）

#### パターンA: 個別にインポート
```javascript
import { seller, goods } from "./shopping";

seller();   // ✅ OK
goods();    // ✅ OK
// shoppingApiという名前は存在しない
```

#### パターンB: `* as` で全部まとめてインポート
```javascript
import * as shoppingApi from "./shopping";

shoppingApi.seller();   // ✅ OK
shoppingApi.goods();    // ✅ OK
shoppingApi.ratings();  // ✅ OK
// shoppingApiはオブジェクトになる
// { seller: Function, goods: Function, ratings: Function }
```

#### パターンC: 名前を変えてインポート
```javascript
import { seller as getSeller, goods as getGoods } from "./shopping";

getSeller();  // ✅ OK
getGoods();   // ✅ OK
```

### 重要ポイント
- ✅ 1ファイルに複数エクスポート可能
- ✅ インポート時は `{}` が必要（`* as` 除く）
- ✅ **エクスポートした名前と同じ名前でインポート**する必要がある（`as` で変更可）

---

## 2. デフォルトエクスポート (Default Export)

### エクスポート側

#### ケース1: オブジェクトをエクスポート
```javascript
// shopping.js
const seller = (params) => { ... }
const goods = (params) => { ... }

export default { seller, goods };  // オブジェクトをエクスポート
```

#### ケース2: 関数を直接エクスポート
```javascript
// utils.js
export default (params) => { ... }  // 1つの関数
```

#### ケース3: クラスをエクスポート
```javascript
// MyClass.js
export default class MyClass {
  // ...
}
```

### インポート側

```javascript
// ケース1の場合（オブジェクト）
import shoppingApi from "./shopping";
// ↑ shoppingApiは自分で好きに決めた名前

shoppingApi.seller();  // ✅ OK
shoppingApi.goods();   // ✅ OK
```

```javascript
// どんな名前でもOK！
import api from "./shopping";
api.seller();  // ✅ OK

import xxx from "./shopping";
xxx.seller();  // ✅ OK
```

### 重要ポイント
- ✅ 1ファイルに**1つだけ**エクスポート可能
- ✅ インポート時は `{}` **不要**
- ✅ **インポート時に好きな名前をつけられる**
- ✅ エクスポートされたものが何か（オブジェクト、関数、クラスなど）によって使い方が変わる

---

## 3. 組み合わせも可能

```javascript
// shopping.js
export const restaurants = () => { ... }  // 名前付き

const seller = () => { ... }
const goods = () => { ... }
export default { seller, goods };  // デフォルト
```

```javascript
// index.vue
import shoppingApi, { restaurants } from "./shopping";

shoppingApi.seller();  // ✅ OK (デフォルト)
restaurants();         // ✅ OK (名前付き)
```

---

## 4. `* as` と `export default` の違い

| 項目 | `* as` | `export default` |
|------|--------|------------------|
| エクスポート側 | `export const xxx` | `export default { ... }` |
| インポート構文 | `import * as 名前` | `import 名前` |
| 何をしている？ | すべての名前付きエクスポートを**集めてオブジェクト化** | 最初から**オブジェクトをエクスポート** |
| 名前の自由度 | `as` の後ろは自由 | 完全に自由 |
| `{}` 必要？ | 不要 | 不要 |
| 個数制限 | 制限なし | 1ファイル1つまで |

---

## 5. 実践例：現在のコード

### 現在の `shopping.js`
```javascript
export const seller = (params) => { ... }
export const goods = (params) => { ... }
export const ratings = (params) => { ... }
export const restaurants = (params) => { ... }
```

### 現在の `index.vue`
```javascript
import * as shoppingApi from "~/assets/services/shopping";

await shoppingApi.seller();
```

### なぜこう書いている？
1. `* as shoppingApi` により、すべての関数が `shoppingApi` オブジェクトにまとめられる
2. 結果として以下のオブジェクトができる：
```javascript
shoppingApi = {
  seller: Function,
  goods: Function,
  ratings: Function,
  restaurants: Function
}
```
3. だから `shoppingApi.seller()` と書ける

---

## 6. クイックリファレンス

### こう書いたら、こうなる

```javascript
// エクスポート: export const seller = ...
import { seller } from "./shopping";
seller();  // 関数を直接呼ぶ

// エクスポート: export const seller = ...
import * as api from "./shopping";
api.seller();  // オブジェクトのメソッドとして呼ぶ

// エクスポート: export default { seller }
import api from "./shopping";
api.seller();  // オブジェクトのメソッドとして呼ぶ

// エクスポート: export default seller
import seller from "./shopping";
seller();  // 関数を直接呼ぶ
```

---

## 7. よくある間違い

### ❌ ダメな例
```javascript
// 名前付きエクスポートを{}なしでインポート
import seller from "./shopping";  // ❌ undefinedになる

// デフォルトエクスポートを{}付きでインポート
import { default } from "./shopping";  // ❌ 構文エラー

// 存在しない名前でインポート
export const seller = ...
import { xxx } from "./shopping";  // ❌ xxxは存在しない
```

### ✅ 正しい例
```javascript
// 名前付きは{}付き
import { seller } from "./shopping";

// デフォルトは{}なし
import api from "./shopping";

// 名前を変えたいなら as を使う
import { seller as getSeller } from "./shopping";
```

---

## まとめ

- **名前付きエクスポート**: 複数の機能を個別にエクスポート、`{}` でインポート
- **デフォルトエクスポート**: 1つのメイン機能をエクスポート、自由な名前でインポート
- **`* as`**: すべての名前付きエクスポートをオブジェクトにまとめる便利技
- **オブジェクト化**: `{}` で囲むか、`* as` を使うとオブジェクトになる

この理解があれば、どんなインポート/エクスポートも読めるようになります！
