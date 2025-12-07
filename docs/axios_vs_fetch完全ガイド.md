Vue.js computed プロパティ - 完全仕様まとめ
📌 基本定義
computed = データを加工（変換）して値を返すプロパティ

🎯 役割（純粋に）
計算する: データを加工・計算
値を返す: return で値を提供
キャッシュする: 依存データが変わらない限り再計算しない
それ以上でも以下でもない。

"computed = {
  // 「元のデータ」を「加工」して「新しい値」を返す
  
  何をやるか:
  - 数学計算（足し算、掛け算など）
  - 条件分岐（if文で値を選ぶ）
  - データ取得（stateから値を取り出す）
  - 文字列加工（結合、整形）
  - 配列操作（filter、mapなど）
  - 型変換（文字列 → 数値など）
  
  共通点:
  - 値を return する
  - 副作用がない（データを変更しない）
  - テンプレートで使う
}"

✅ 絶対ルール
1. 必ず return が必要

"computed: {
  // ✅ 正しい
  userName() {
    return this.user.name;
  },
  
  // ❌ 間違い: returnがない
  userName() {
    this.user.name;  // 値が返らない → undefined
  }
}"

2. 副作用のある処理を書かない

"computed: {
  // ❌ 悪い例: データを変更している
  badExample() {
    this.count++;  // computed内でデータを変更しない
    return this.count;
  },
  
  // ✅ 良い例: 計算だけして返す
  goodExample() {
    return this.count * 2;  // 計算のみ
  }
}"

3. テンプレートで使うための値を提供

"<template>
  <!-- computed の値を使う -->
  <div>{{ totalPrice }}</div>
  <button :class=""buttonClass"">クリック</button>
</template>

<script>
computed: {
  totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
  buttonClass() {
    return this.isActive ? 'active' : 'inactive';
  }
}
</script>"

📊 computed vs watch vs methods
computed
役割
return
キャッシュ
使い方
再実行

🔥 典型的な使用例
1. 合計・集計

"computed: {
  totalPrice() {
    let total = 0;
    this.items.forEach(item => {
      total += item.price * item.count;
    });
    return total;  // 必ず return
  }
}"

2. 条件分岐の結果

"computed: {
  statusMessage() {
    if (this.isLoggedIn) {
      return 'ログイン済み';
    } else {
      return '未ログイン';
    }
  }
}"

3. CSS クラス名の決定

"computed: {
  buttonClass() {
    if (this.totalPrice < this.minPrice) {
      return 'not-enough';  // 不足
    } else {
      return 'enough';      // 十分
    }
  }
}"

"<template>
  <div :class=""buttonClass"">ボタン</div>
</template>"

4. データの整形

"computed: {
  formattedDate() {
    return new Date(this.timestamp).toLocaleDateString('ja-JP');
  },
  
  displayName() {
    return this.firstName + ' ' + this.lastName;
  }
}"

5. Vuex との連携（mapGetters）

"import { mapGetters } from 'vuex';

computed: {
  ...mapGetters(['userInfo'])
  
  // ↑ これが展開されると ↓
  
  userInfo() {
    return this.$store.getters.userInfo;
  }
}"

⚡ キャッシュの仕組み

"computed: {
  // 依存: firstName, lastName
  fullName() {
    console.log('計算実行！');
    return this.firstName + ' ' + this.lastName;
  }
}"

"// 1回目: 計算実行
this.fullName;  // ""Taro Yamada"" ← console.log出力

// 2回目: キャッシュを返す（計算しない）
this.fullName;  // ""Taro Yamada"" ← console.log出力なし

// データ変更後: 再計算
this.firstName = 'Hanako';
this.fullName;  // ""Hanako Yamada"" ← console.log出力"

依存データが変わらない限り、何度呼んでも1回しか計算しない = 高速

🚫 やってはいけないこと
❌ データの変更

"computed: {
  badExample() {
    this.count++;  // NG: 副作用
    return this.count;
  }
}"

❌ API 呼び出し

"computed: {
  badExample() {
    fetch('/api/data');  // NG: 非同期処理
    return this.data;
  }
}"

❌ return なし

"computed: {
  badExample() {
    let result = this.a + this.b;
    // return がない → undefined
  }
}"

🎓 重要ポイント
computed は計算のみ、処理は書かない
必ず return で値を返す
テンプレートで使う値を提供するのが目的
キャッシュされるので高速（依存データ変更時のみ再計算）
副作用（データ変更、API呼び出し）は watch や methods で
📝 簡単な覚え方

"computed = テンプレートのための計算機

・計算する
・値を返す（return必須）
・キャッシュする
・それだけ"

🔄 実際の動作フロー

"1. テンプレートが {{ totalPrice }} を参照
   ↓
2. computed の totalPrice() 関数が実行される
   ↓
3. 計算結果を return
   ↓
4. 結果がキャッシュされる
   ↓
5. 次回呼ばれた時、依存データが変わってなければキャッシュを返す
   ↓
6. 依存データが変わったら再計算"

---

## 🎯 computed と template の連携（超重要）

### 📌 computed は template で「変数」として扱える

computedに書いた関数は、**template内で変数のように使える**。

```vue
<script>
export default {
  data() {
    return {
      orderListArr: [
        { id: 1, shopName: 'A店', name: '商品1' },
        { id: 2, shopName: 'B店', name: '商品2' },
        { id: 3, shopName: 'C店', name: '商品3' }
      ],
      searchShopName: ''
    }
  },
  computed: {
    filteredOrderList() {
      if (!this.searchShopName) {
        return this.orderListArr;  // 検索欄が空なら全件返す
      }
      return this.orderListArr.filter(item =>
        item.shopName.includes(this.searchShopName)
      );
    }
  }
}
</script>

<template>
  <div>
    <input v-model="searchShopName" placeholder="店舗名検索">
    
    <!-- filteredOrderList を変数として使える -->
    <ul v-if="filteredOrderList.length">
      <li v-for="item in filteredOrderList" :key="item.id">
        {{ item.shopName }} - {{ item.name }}
      </li>
    </ul>
  </div>
</template>
```

### 🔥 重要ポイント

1. **computed に書くと変数になる**
   - `filteredOrderList()`と書いても、template内では`{{ filteredOrderList }}`のように変数として使える
   - `filteredOrderList.length`や`v-for="item in filteredOrderList"`が可能

2. **methods に書くと関数のまま**
   - `methods: { filteredOrderList() {...} }`と書いた場合
   - template内で`{{ filteredOrderList() }}`のように**関数として呼び出す必要がある**
   - リアクティブに自動更新されない

3. **リアクティブな自動更新**
   - computedは依存するデータ（`searchShopName`や`orderListArr`）が変わると自動で再計算される
   - template内の表示も自動で更新される

---

### 💡 実際の動作イメージ

#### 検索欄が空の時
```js
searchShopName = ''

filteredOrderList() {
  if (!this.searchShopName) {  // true
    return this.orderListArr;  // 全件返す
  }
}

// template内
v-if="filteredOrderList.length"  // → orderListArr.length と同じ（全件表示）
v-for="item in filteredOrderList"  // → orderListArr を全件ループ
```

#### 検索欄に「A店」と入力した時
```js
searchShopName = 'A店'

filteredOrderList() {
  if (!this.searchShopName) {  // false
    return this.orderListArr;
  }
  // A店だけフィルタリング
  return this.orderListArr.filter(item =>
    item.shopName.includes(this.searchShopName)
  );
}

// template内
v-if="filteredOrderList.length"  // → A店の件数のみ
v-for="item in filteredOrderList"  // → A店のデータのみループ
```

---

### 🚨 よくある誤解

#### ❌ 誤解：「filteredOrderListがorderListArrに上書きされる」
**違います！**
- `orderListArr`は元データとして保持されたまま
- `filteredOrderList`は「orderListArrを参照して返しているだけ」
- 元データは一切変更されていない

#### ✅ 正しい理解：「参照して返しているだけ」
```js
// 例え：本棚と本の束
orderListArr = 本棚（全データ）
filteredOrderList = 今見ている本の束（表示するデータ）

検索欄が空    → 本棚の本を全部持ってきて見る
検索欄に入力  → 本棚から条件に合う本だけ抜き出して見る

本棚の本は減らない、増えない、変わらない。
見る本の束だけが変わる。
```

---

### 📊 computed vs methods（template内での違い）

| 項目 | computed | methods |
|------|----------|---------|
| template内での使い方 | `{{ filteredOrderList }}` | `{{ filteredOrderList() }}` |
| 変数として扱える | ✅ はい | ❌ いいえ |
| `.length`が使える | ✅ `filteredOrderList.length` | ❌ `filteredOrderList().length` |
| `v-for`で使える | ✅ `v-for="item in filteredOrderList"` | ❌ `v-for="item in filteredOrderList()"` |
| リアクティブ | ✅ 自動更新 | ❌ 手動で呼び出す必要あり |
| キャッシュ | ✅ あり | ❌ なし |

---

### 🎓 まとめ

- **computedに書くと、template内で変数として使える**
- **methodsに書くと、関数として呼び出す必要がある**
- **フィルタリングや検索機能は、computedでしか実現できない**
- **元データは変わらず、返す値が変わるだけ**
- **これがVue.jsのリアクティブシステムの核心**

---

## 🔥 実務で超頻出！computedの重宝パターン集

### 1. 配列の要素数チェック（isEmpty系）

**使用例：カートが空かどうか判定**

```vue
<script>
export default {
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    hasItems() {
      return this.cartItems.length > 0;
    },
    isEmpty() {
      return this.cartItems.length === 0;
    }
  }
}
</script>

<template>
  <div v-if="hasItems">カートに商品があります</div>
  <div v-else>カートは空です</div>
</template>
```

---

### 2. 合計金額・集計系

**使用例：カート内の合計金額を計算**

```vue
<script>
export default {
  data() {
    return {
      cartItems: [
        { id: 1, name: 'りんご', price: 100, count: 3 },
        { id: 2, name: 'バナナ', price: 80, count: 5 }
      ]
    }
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
    },
    totalCount() {
      return this.cartItems.reduce((sum, item) => sum + item.count, 0);
    }
  }
}
</script>

<template>
  <div>合計金額: {{ totalPrice }}円</div>
  <div>合計個数: {{ totalCount }}個</div>
</template>
```

---

### 3. 条件分岐でクラス名を返す

**使用例：ボタンの状態でクラスを切り替え**

```vue
<script>
export default {
  data() {
    return {
      isActive: false,
      totalPrice: 1000,
      minPrice: 1500
    }
  },
  computed: {
    buttonClass() {
      return this.isActive ? 'btn-active' : 'btn-inactive';
    },
    priceStatus() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    }
  }
}
</script>

<template>
  <button :class="buttonClass">ボタン</button>
  <div :class="priceStatus">合計金額: {{ totalPrice }}円</div>
</template>
```

---

### 4. 配列の並び替え（sort）

**使用例：注文日順に並び替え**

```vue
<script>
export default {
  data() {
    return {
      orders: [
        { id: 1, name: '商品A', date: '2025-11-20' },
        { id: 2, name: '商品B', date: '2025-11-22' },
        { id: 3, name: '商品C', date: '2025-11-19' }
      ],
      sortOrder: 'desc'  // 'asc' or 'desc'
    }
  },
  computed: {
    sortedOrders() {
      const sorted = [...this.orders].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      return this.sortOrder === 'desc' ? sorted.reverse() : sorted;
    }
  }
}
</script>

<template>
  <ul>
    <li v-for="order in sortedOrders" :key="order.id">
      {{ order.name }} - {{ order.date }}
    </li>
  </ul>
</template>
```

---

### 5. 配列の加工（map）

**使用例：商品名だけを抽出**

```vue
<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'りんご', price: 100 },
        { id: 2, name: 'バナナ', price: 80 },
        { id: 3, name: 'みかん', price: 120 }
      ]
    }
  },
  computed: {
    itemNames() {
      return this.items.map(item => item.name);
    },
    itemNamesText() {
      return this.items.map(item => item.name).join(', ');
    }
  }
}
</script>

<template>
  <div>商品一覧: {{ itemNamesText }}</div>
</template>
```

---

### 6. Vuexのgetter参照

**使用例：ログイン情報を取得**

```vue
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['userInfo', 'isLoggedIn'])
    
    // ↑ これが展開されると ↓
    
    // userInfo() {
    //   return this.$store.getters.userInfo;
    // },
    // isLoggedIn() {
    //   return this.$store.getters.isLoggedIn;
    // }
  }
}
</script>

<template>
  <div v-if="isLoggedIn">
    ようこそ、{{ userInfo.name }}さん
  </div>
  <div v-else>
    ログインしてください
  </div>
</template>
```

---

### 7. 日付の整形

**使用例：タイムスタンプを日本語表記に変換**

```vue
<script>
export default {
  data() {
    return {
      orderDate: '2025-11-23T10:30:00',
      timestamp: 1700745000000
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.orderDate).toLocaleDateString('ja-JP');
    },
    formattedDateTime() {
      return new Date(this.timestamp).toLocaleString('ja-JP');
    }
  }
}
</script>

<template>
  <div>注文日: {{ formattedDate }}</div>
  <div>注文日時: {{ formattedDateTime }}</div>
</template>
```

---

### 8. 検索結果の件数表示

**使用例：フィルタリング後の件数を表示**

```vue
<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'りんご', category: '果物' },
        { id: 2, name: 'バナナ', category: '果物' },
        { id: 3, name: 'にんじん', category: '野菜' }
      ],
      searchCategory: '果物'
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchCategory) {
        return this.items;
      }
      return this.items.filter(item => item.category === this.searchCategory);
    },
    resultCount() {
      return this.filteredItems.length;
    }
  }
}
</script>

<template>
  <div>検索結果: {{ resultCount }}件</div>
  <ul>
    <li v-for="item in filteredItems" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

---

### 9. 文字列の整形・結合

**使用例：姓名を結合して表示**

```vue
<script>
export default {
  data() {
    return {
      firstName: '太郎',
      lastName: '山田',
      price: 1234567
    }
  },
  computed: {
    fullName() {
      return `${this.lastName} ${this.firstName}`;
    },
    formattedPrice() {
      return this.price.toLocaleString('ja-JP') + '円';
    }
  }
}
</script>

<template>
  <div>お名前: {{ fullName }}</div>
  <div>価格: {{ formattedPrice }}</div>
</template>
```

---

### 10. 条件付き表示用のフラグ

**使用例：エラー有無や完了状態の判定**

```vue
<script>
export default {
  data() {
    return {
      errors: [],
      progress: 80
    }
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0;
    },
    isComplete() {
      return this.progress >= 100;
    },
    statusText() {
      if (this.isComplete) return '完了';
      if (this.progress > 50) return '進行中';
      return '開始前';
    }
  }
}
</script>

<template>
  <div v-if="hasErrors" class="error">エラーがあります</div>
  <div>{{ statusText }}</div>
</template>
```

---

## 📌 実務での使い分けまとめ

| パターン | 使用場面 | computed の役割 |
|---------|---------|----------------|
| `.length` | 件数チェック、空判定 | 配列の要素数を返す |
| `reduce` | 合計金額、集計 | 配列を集計して1つの値を返す |
| `filter` | 検索、絞り込み | 条件に合う要素だけ返す |
| `sort` | 並び替え | 配列を並び替えて返す |
| `map` | データ抽出、加工 | 配列の各要素を加工して返す |
| 条件分岐 | クラス名、ステータス | 条件に応じた値を返す |
| Vuex連携 | グローバル状態参照 | storeから値を取得して返す |
| 日付整形 | 日付表示 | Date型を文字列に変換して返す |

---

## 🎯 重要ポイント

- **これらのパターンは実務でほぼ毎回使う**
- **computedで書けば、リアクティブに自動更新される**
- **methodsで書くと、手動で呼び出す必要があり、非効率**
- **これらを使いこなせれば、Vueの実装力は一段上がる**
