# JavaScript グローバル関数 完全まとめ

JavaScriptに標準搭載されている、**どこからでも使える超メジャーな関数**をカテゴリ別に整理。

---

## 📌 タイマー系（超頻出）

### setTimeout()
**指定時間後に1回だけ実行**

```javascript
// 基本
setTimeout(() => {
  console.log('3秒後に実行');
}, 3000);

// 引数を渡す
setTimeout((name) => {
  console.log(`${name}さん、こんにちは`);
}, 2000, "太郎");

// キャンセル可能
const timerId = setTimeout(() => {
  console.log('これは実行されない');
}, 5000);
clearTimeout(timerId); // キャンセル
```

| パラメータ | 説明 |
|-----------|------|
| callback | 実行する関数 |
| delay | 遅延時間（ミリ秒） |
| ...args | callbackに渡す引数 |
| **戻り値** | タイマーID（数値） |

### setInterval()
**指定間隔で繰り返し実行**

```javascript
// 1秒ごとに実行
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`${count}秒経過`);
  
  if (count === 5) {
    clearInterval(intervalId); // 5秒で停止
  }
}, 1000);
```

**注意**: 停止しないと永遠に実行される → 必ず `clearInterval()` で停止すること

---

## 🖥️ コンソール出力系（デバッグ必須）

### console.log()
**通常のログ出力**

```javascript
console.log('こんにちは');
console.log('名前:', 'たろう', '年齢:', 25);
console.log({ name: '太郎', age: 25 }); // オブジェクトも見やすく表示
```

### console.error()
**エラーメッセージ（赤色で表示）**

```javascript
console.error('エラーが発生しました！');
```

### console.warn()
**警告メッセージ（黄色で表示）**

```javascript
console.warn('この機能は非推奨です');
```

### console.table()
**配列やオブジェクトを表形式で表示**

```javascript
const users = [
  { name: '太郎', age: 25 },
  { name: '花子', age: 30 }
];
console.table(users);
```

---

## 🔢 数値変換系（超頻出）

### parseInt()
**文字列を整数に変換**

```javascript
parseInt('123');        // 123
parseInt('123.45');     // 123（小数点以下切り捨て）
parseInt('10', 2);      // 2（2進数として解釈）
parseInt('FF', 16);     // 255（16進数として解釈）
parseInt('abc');        // NaN（変換不可）
```

| パラメータ | 説明 |
|-----------|------|
| string | 変換する文字列 |
| radix | 基数（2〜36、省略時は10） |

### parseFloat()
**文字列を小数に変換**

```javascript
parseFloat('123.45');   // 123.45
parseFloat('3.14円');   // 3.14（数値部分のみ）
parseFloat('abc');      // NaN
```

### Number()
**数値に変換（厳密）**

```javascript
Number('123');          // 123
Number('123.45');       // 123.45
Number('123abc');       // NaN（parseIntと違い厳密）
Number(true);           // 1
Number(false);          // 0
Number(null);           // 0
```

---

## ✅ 値チェック系

### isNaN()
**NaN（Not a Number）かどうか**

```javascript
isNaN(NaN);             // true
isNaN('abc');           // true
isNaN(123);             // false
isNaN('123');           // false（数値に変換できる）

// より正確なチェック
Number.isNaN(NaN);      // true
Number.isNaN('abc');    // false（変換せず判定）
```

### isFinite()
**有限数かどうか**

```javascript
isFinite(123);          // true
isFinite(Infinity);     // false
isFinite(-Infinity);    // false
isFinite(NaN);          // false
```

---

## 📦 JSON操作系（API通信必須）

### JSON.parse()
**JSON文字列をオブジェクトに変換**

```javascript
const jsonString = '{"name":"太郎","age":25}';
const obj = JSON.parse(jsonString);
console.log(obj.name);  // "太郎"

// エラー処理
try {
  JSON.parse('不正なJSON');
} catch (error) {
  console.error('JSON解析エラー');
}
```

### JSON.stringify()
**オブジェクトをJSON文字列に変換**

```javascript
const obj = { name: '太郎', age: 25 };
const jsonString = JSON.stringify(obj);
console.log(jsonString);  // '{"name":"太郎","age":25}'

// 整形（インデント付き）
const pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "太郎",
  "age": 25
}
*/
```

---

## 🔤 文字列エンコード系（URL操作必須）

### encodeURIComponent()
**URLパラメータ用にエンコード**

```javascript
const keyword = 'ラーメン 東京';
const encoded = encodeURIComponent(keyword);
console.log(encoded);  // "%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E6%9D%B1%E4%BA%AC"

// 実際の使用例
const url = `https://example.com/search?q=${encodeURIComponent(keyword)}`;
```

### decodeURIComponent()
**URLエンコードをデコード**

```javascript
const encoded = '%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3';
const decoded = decodeURIComponent(encoded);
console.log(decoded);  // "ラーメン"
```

---

## 🎲 Math系（計算必須）

### Math.floor()
**切り捨て**

```javascript
Math.floor(4.9);   // 4
Math.floor(4.1);   // 4
Math.floor(-4.1);  // -5（負の無限大方向）
```

### Math.ceil()
**切り上げ**

```javascript
Math.ceil(4.1);    // 5
Math.ceil(4.9);    // 5
Math.ceil(-4.9);   // -4（正の無限大方向）
```

### Math.round()
**四捨五入**

```javascript
Math.round(4.4);   // 4
Math.round(4.5);   // 5
Math.round(4.6);   // 5
```

### Math.random()
**0以上1未満のランダムな数**

```javascript
Math.random();  // 0.123456789...

// 1〜10のランダムな整数
const random = Math.floor(Math.random() * 10) + 1;

// min〜maxのランダムな整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### Math.max() / Math.min()
**最大値/最小値**

```javascript
Math.max(1, 5, 3, 9, 2);     // 9
Math.min(1, 5, 3, 9, 2);     // 1

// 配列の最大値
const arr = [1, 5, 3, 9, 2];
Math.max(...arr);            // 9（スプレッド構文）
```

### Math.abs()
**絶対値**

```javascript
Math.abs(-5);    // 5
Math.abs(5);     // 5
Math.abs(-3.5);  // 3.5
```

### Math.pow()
**べき乗**

```javascript
Math.pow(2, 3);   // 8（2の3乗）
Math.pow(5, 2);   // 25（5の2乗）

// 現代的な書き方
2 ** 3;           // 8
```

---

## 📅 Date系（日時操作必須）

### Date.now()
**現在時刻のタイムスタンプ（ミリ秒）**

```javascript
const now = Date.now();
console.log(now);  // 1738280400000（例）

// ユニークIDとして使用
const id = Date.now();

// 処理時間の計測
const start = Date.now();
// 何か処理
const end = Date.now();
console.log(`処理時間: ${end - start}ms`);
```

### new Date()
**日付オブジェクト作成**

```javascript
// 現在日時
const now = new Date();

// 特定の日時
const date = new Date('2026-01-31');
const date2 = new Date(2026, 0, 31); // 月は0始まり

// タイムスタンプから
const date3 = new Date(1738280400000);

// よく使うメソッド
now.getFullYear();   // 2026
now.getMonth();      // 0〜11（0が1月）
now.getDate();       // 1〜31
now.getDay();        // 0〜6（0が日曜）
now.getHours();      // 0〜23
now.getMinutes();    // 0〜59
now.getSeconds();    // 0〜59
```

---

## 🌐 ブラウザ専用グローバル関数

### alert()
**アラート表示**

```javascript
alert('警告メッセージ');
```

⚠️ **使用非推奨**: ユーザー体験が悪いため、Toastなどで代替推奨

### confirm()
**確認ダイアログ**

```javascript
const result = confirm('削除してもよろしいですか？');
if (result) {
  console.log('削除実行');
} else {
  console.log('キャンセル');
}
```

### prompt()
**入力ダイアログ**

```javascript
const name = prompt('お名前を入力してください', 'デフォルト値');
if (name) {
  console.log(`こんにちは、${name}さん`);
}
```

### fetch()
**HTTP通信（非同期）**

```javascript
// GET リクエスト
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// async/await版
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// POST リクエスト
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: '太郎', age: 25 })
});
```

---

## 🗄️ ブラウザストレージ系

### localStorage
**永続的なデータ保存**

```javascript
// 保存
localStorage.setItem('username', '太郎');
localStorage.setItem('settings', JSON.stringify({ theme: 'dark' }));

// 取得
const username = localStorage.getItem('username');
const settings = JSON.parse(localStorage.getItem('settings'));

// 削除
localStorage.removeItem('username');

// 全削除
localStorage.clear();
```

### sessionStorage
**セッション中のみ保存（タブ閉じると消える）**

```javascript
// 使い方はlocalStorageと同じ
sessionStorage.setItem('tempData', 'value');
const data = sessionStorage.getItem('tempData');
```

---

## 🔍 実務でよく使う組み合わせパターン

### パターン1: API取得後の配列処理

```javascript
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    
    // 年齢の最大値
    const maxAge = Math.max(...users.map(u => u.age));
    
    console.table(users);
  } catch (error) {
    console.error('取得失敗:', error);
  }
}
```

### パターン2: ローカルストレージにJSON保存

```javascript
// 保存
const cart = [
  { id: 1, name: 'りんご', price: 100 },
  { id: 2, name: 'みかん', price: 80 }
];
localStorage.setItem('cart', JSON.stringify(cart));

// 取得
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
```

### パターン3: タイムスタンプでユニークID生成

```javascript
function createItem(name) {
  return {
    id: Date.now(),
    name: name,
    createdAt: new Date().toISOString()
  };
}

const item = createItem('新しいアイテム');
// { id: 1738280400000, name: "新しいアイテム", createdAt: "2026-01-31T10:00:00.000Z" }
```

### パターン4: デバウンス（連続実行防止）

```javascript
let timeoutId = null;

function search(keyword) {
  clearTimeout(timeoutId);
  
  timeoutId = setTimeout(() => {
    console.log(`検索実行: ${keyword}`);
    // API呼び出しなど
  }, 500); // 500ms待ってから実行
}

// 連続で呼ばれても最後の1回だけ実行される
search('ラ');
search('ラー');
search('ラーメン'); // これだけ実行される
```

---

## 📊 まとめ表

| カテゴリ | よく使う関数 | 使用頻度 |
|---------|------------|---------|
| **タイマー** | setTimeout, setInterval | ⭐⭐⭐⭐⭐ |
| **コンソール** | console.log, console.error | ⭐⭐⭐⭐⭐ |
| **数値変換** | parseInt, parseFloat | ⭐⭐⭐⭐⭐ |
| **JSON** | JSON.parse, JSON.stringify | ⭐⭐⭐⭐⭐ |
| **Math** | Math.floor, Math.random | ⭐⭐⭐⭐ |
| **Date** | Date.now, new Date() | ⭐⭐⭐⭐ |
| **fetch** | fetch() | ⭐⭐⭐⭐⭐ |
| **Storage** | localStorage, sessionStorage | ⭐⭐⭐⭐ |
| **URL** | encodeURIComponent | ⭐⭐⭐ |
| **ダイアログ** | alert, confirm | ⭐（非推奨） |

---

## 🚨 よくある間違い

### 1. setTimeoutを止め忘れ

```javascript
// ❌ 悪い例
data() {
  return { timerId: null };
}
mounted() {
  this.timerId = setTimeout(() => {
    // 処理
  }, 3000);
}
// コンポーネント破棄時に止めてない → メモリリーク

// ✅ 良い例
beforeDestroy() {
  clearTimeout(this.timerId);
}
```

### 2. JSON.parseのエラー処理なし

```javascript
// ❌ 悪い例
const data = JSON.parse(localStorage.getItem('data'));
// 不正なJSONだとエラー

// ✅ 良い例
try {
  const data = JSON.parse(localStorage.getItem('data'));
} catch (error) {
  console.error('JSON解析エラー');
}
```

### 3. Math.randomの範囲指定ミス

```javascript
// ❌ 悪い例（0〜9しか出ない）
const random = Math.floor(Math.random() * 10);

// ✅ 良い例（1〜10が出る）
const random = Math.floor(Math.random() * 10) + 1;
```

---

## 💡 覚えておくべきポイント

1. **グローバル関数 = どこからでも使える**（import不要）
2. **setTimeout/setIntervalは必ずclearする**（メモリリーク防止）
3. **JSON操作は必ずtry-catchで囲む**（エラー対策）
4. **Date.now()はミリ秒**（秒ではない）
5. **console.logは本番環境では削除**（パフォーマンス）
6. **alertは使わない**（UX悪い、Toastで代替）
7. **localStorageは5MBまで**（大量データ保存不可）
8. **parseIntは基数を指定**（parseInt('08', 10)）

これらを覚えれば、実務でのJavaScript開発がかなり楽になります！
