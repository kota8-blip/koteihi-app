# Vueライフサイクル完全ガイド

## 📌 結論

**Vueコンポーネントは「生成 → 初期化 → 描画 → 破棄」の順番で動く**

---

## 🔥 ライフサイクルの全体像

```
1. beforeCreate（生成前）
2. created（生成完了）
3. beforeMount（描画前）
4. mounted（描画完了）
5. beforeUpdate（更新前）
6. updated（更新完了）
7. beforeDestroy（破棄前）
8. destroyed（破棄完了）
```

---

## ⚡ 初期化の順序（重要）

### 1. **data()**
- **タイミング：コンポーネント生成時（beforeCreate と created の間）**
- **役割：データ（状態）を初期化する**
- **特徴：ここで定義された値は、リアクティブ（自動更新）になる**

```javascript
data() {
  return {
    cartItems: [],
    count: 0
  }
}
```

→ **`this.cartItems`や`this.count`が使えるようになる**

---

### 2. **computed**
- **タイミング：data() の後、mounted() の前**
- **役割：初期データを元に計算する（自動的に再計算される）**
- **特徴：依存するデータが変わると自動で再計算される**

```javascript
computed: {
  totalPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}
```

→ **`this.totalPrice`が使えるようになる（cartItemsが変わると自動で再計算）**

---

### 3. **methods**
- **タイミング：data() と computed の後**
- **役割：メソッド（関数）を定義する**
- **特徴：定義されるだけで、実行はされない（呼ばれた時だけ動く）**

```javascript
methods: {
  addCount(item) {
    item.quantity++;
  }
}
```

→ **`this.addCount(item)`が使えるようになる（まだ実行はされない）**

---

### 4. **mounted()**
- **タイミング：DOM描画後（画面に表示された後）**
- **役割：初期データ取得や、DOMを操作する処理を実行**
- **特徴：ここで初めてAPI通信やDOM操作ができる**

```javascript
mounted() {
  this.initData(); // API通信でデータ取得
}
```

→ **画面表示後に自動で実行される**

---

## 📖 各ライフサイクルの詳細

### 1. **beforeCreate**
- **いつ：コンポーネントが生成される直前**
- **何ができる：ほぼ何もできない（dataやmethodsにアクセスできない）**
- **使う場面：ほぼ使わない**

---

### 2. **created**
- **いつ：dataやcomputedが使えるようになった直後**
- **何ができる：dataやmethodsにアクセスできる（ただしDOMはまだない）**
- **使う場面：API通信でデータ取得（ただし、mountedの方がよく使われる）**

```javascript
created() {
  console.log(this.cartItems); // dataにアクセス可能
}
```

---

### 3. **beforeMount**
- **いつ：DOMに描画される直前**
- **何ができる：dataやmethodsにアクセスできる（ただしDOMはまだない）**
- **使う場面：ほぼ使わない**

---

### 4. **mounted**（最重要）
- **いつ：DOMに描画された直後**
- **何ができる：全てのデータとDOMにアクセスできる**
- **使う場面：API通信、DOM操作、初期化処理**

```javascript
mounted() {
  this.initData(); // API通信
  document.querySelector('.cart').style.color = 'red'; // DOM操作
}
```

---

### 5. **beforeUpdate**
- **いつ：dataが変わって、DOMが再描画される直前**
- **何ができる：変更前の状態を確認できる**
- **使う場面：ほぼ使わない**

---

### 6. **updated**
- **いつ：dataが変わって、DOMが再描画された直後**
- **何ができる：更新後のDOMを操作できる**
- **使う場面：DOM更新後の処理（ただし、watchやcomputedの方が良い場合が多い）**

```javascript
updated() {
  console.log('DOMが更新された');
}
```

---

### 7. **beforeDestroy**
- **いつ：コンポーネントが破棄される直前**
- **何ができる：まだデータやDOMにアクセスできる**
- **使う場面：タイマーやイベントリスナーの解除**

```javascript
beforeDestroy() {
  clearInterval(this.timer); // タイマー解除
}
```

---

### 8. **destroyed**
- **いつ：コンポーネントが破棄された直後**
- **何ができる：ほぼ何もできない**
- **使う場面：ほぼ使わない**

---

## ✅ よく使うライフサイクル

| ライフサイクル | 使用頻度 | 使う場面 |
|---------------|---------|---------|
| **mounted** | ⭐⭐⭐⭐⭐ | API通信、DOM操作、初期化処理 |
| **created** | ⭐⭐⭐ | API通信（DOMが不要な場合） |
| **updated** | ⭐⭐ | DOM更新後の処理 |
| **beforeDestroy** | ⭐⭐ | タイマーやイベントリスナーの解除 |
| その他 | ⭐ | ほぼ使わない |

---

## 🔍 実際の動き（cart.vueの例）

```javascript
export default {
  data() {
    return {
      cartItems: [] // 1. 最初に初期化される
    }
  },
  computed: {
    totalPrice() { // 2. dataの後に評価される
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  mounted() { // 3. DOM描画後に自動で実行される
    this.initData(); // 4. API通信でデータ取得
  },
  methods: {
    async initData() { // 5. mounted()から呼ばれて初めて実行される
      let res = await cartItems(this.userInfo.user_id);
      if (res && Array.isArray(res)) {
        this.cartItems = [...res]; // 6. データが更新される
      }
    }
  }
}
```

### 実行順序
1. `data()`で`cartItems`が初期化（空配列）
2. `computed`で`totalPrice`が評価（0円）
3. `methods`で`initData`が定義される（まだ実行されない）
4. `mounted()`が自動で実行される
5. `mounted()`内の`this.initData()`が呼ばれる
6. API通信でデータ取得
7. `this.cartItems`が更新される
8. `computed`の`totalPrice`が自動で再計算される
9. 画面が更新される

---

## 💡 重要なポイント

### ポイント1：定義と実行は別
- **data, computed, methods**は「定義される」だけで、自動では実行されない
- **mounted()**などのライフサイクルや、イベント（クリックなど）で初めて実行される

### ポイント2：computedは自動で再計算される
- 依存するデータ（例：`cartItems`）が変わると、自動で再計算される
- methodsは呼ばれた時だけ実行される

### ポイント3：mountedが最重要
- 実務では**mounted()**でAPI通信や初期化処理をすることが最も多い
- DOM操作もmounted()で行う

---

## 📊 まとめ

### 初期化の順序
1. **data()** → データ初期化
2. **computed** → 計算式の評価
3. **methods** → メソッドの定義（実行はされない）
4. **mounted()** → DOM描画後に自動実行

### 覚えるべきライフサイクル
- **mounted()** → API通信、DOM操作、初期化処理（最重要）
- **created()** → API通信（DOMが不要な場合）
- **beforeDestroy()** → タイマーやイベントリスナーの解除

---

**実務では、ほぼ`mounted()`だけ使えれば問題ありません！**
