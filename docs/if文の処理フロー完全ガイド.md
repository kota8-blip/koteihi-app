# if文の処理フロー完全ガイド

## if文の基本仕様

if文は「条件によって処理を分岐する」制御構文です。  
上から順に条件を評価し、trueになった分岐の処理を実行します。

---

## if文の基本構造

### パターン1: if だけ
```javascript
if (条件) {
  // 条件がtrueの時だけ実行される
}
// if文の外の処理（必ず実行される）
```

### パターン2: if ～ else
```javascript
if (条件) {
  // 条件がtrueの時に実行される
} else {
  // 条件がfalseの時に実行される
}
// if文の外の処理（必ず実行される）
```

### パターン3: if ～ else if ～ else
```javascript
if (条件A) {
  // 条件Aがtrueの時に実行される
} else if (条件B) {
  // 条件Aがfalseで、条件Bがtrueの時に実行される
} else {
  // 条件A、条件Bが両方falseの時に実行される
}
// if文の外の処理（必ず実行される）
```

---

## returnの有無による動作の違い

### ケース1: returnがない場合（処理だけ実行）
```javascript
function printMessage(value) {
  if (value === 1) {
    console.log("one");
  } else if (value === 2) {
    console.log("two");
  } else {
    console.log("other");
  }
  // returnがないので、undefinedが返される
  // if文の後の処理があれば、それも実行される
  console.log("処理終了");
}

printMessage(1);
// 出力: "one"
// 出力: "処理終了"
```

### ケース2: returnがある場合（値を返して終了）
```javascript
function getMessage(value) {
  if (value === 1) {
    return "one";
    // ↑ ここで関数終了、以下の処理は実行されない
  } else if (value === 2) {
    return "two";
    // ↑ ここで関数終了
  } else {
    return "other";
    // ↑ ここで関数終了
  }
  // ↓ この行は絶対に実行されない（すべての分岐でreturnしているため）
  console.log("処理終了");
}

const result = getMessage(1); // "one"
```

### ケース3: returnが途中にある場合
```javascript
function checkValue(value) {
  if (value === 1) {
    console.log("処理A");
    // returnがないので次の処理に進む
  } else if (value === 2) {
    return "処理B終了";
    // ↑ ここで関数終了
  }
  // 条件1がtrueの場合は、ここも実行される
  console.log("最後の処理");
  return "終了";
}

checkValue(1);
// 出力: "処理A"
// 出力: "最後の処理"
// 戻り値: "終了"

checkValue(2);
// 出力: なし
// 戻り値: "処理B終了"
```

---

## 実例: required関数の処理の流れ

### コード全体
```javascript
static required(value) {
  if (typeof value === 'number') {
    value = value.toString();
  } else if (typeof value === 'boolean') {
    return !0;
  }
  return value && value.length > 0;
}
```

### 処理フロー
```
1. if (typeof value === 'number')
   ↓ true
   文字列に変換（returnなし）→ 次の処理へ
   ↓ false
   
2. else if (typeof value === 'boolean')
   ↓ true
   return !0; で終了
   ↓ false
   
3. return value && value.length > 0;
   で判定して終了
```

### 各パターンの動作例

**数値の場合:**
```javascript
required(123)
// 1. typeof 123 === 'number' → true
// 2. value = "123" に変換（returnなし）
// 3. return "123" && "123".length > 0;
// 4. true を返す
```

**boolean型の場合:**
```javascript
required(true)
// 1. typeof true === 'number' → false
// 2. typeof true === 'boolean' → true
// 3. return !0; → true を返して終了
// 4. 最後のreturnには到達しない
```

**文字列の場合:**
```javascript
required("hello")
// 1. typeof "hello" === 'number' → false
// 2. typeof "hello" === 'boolean' → false
// 3. return "hello" && "hello".length > 0;
// 4. true を返す
```

**空文字列の場合:**
```javascript
required("")
// 1. typeof "" === 'number' → false
// 2. typeof "" === 'boolean' → false
// 3. return "" && "".length > 0;
// 4. "" (falsy) → false を返す
```

---

## 重要なポイント

### ポイント1: returnの役割
- **returnがある** → その時点で関数終了、それ以降の処理は実行されない
- **returnがない** → 次の処理に進む
- **returnがなくても関数は終了する** → undefinedが返される

### ポイント2: if文の評価順序
1. 上から順に条件を評価する
2. 最初にtrueになった分岐を実行する
3. 一度どれかの分岐に入ったら、他の分岐はチェックしない
4. どの条件もfalseなら、elseがあればそれを実行

### ポイント3: if文とreturnの組み合わせ
```javascript
// パターンA: 全ての分岐でreturn
function example1(value) {
  if (value > 0) {
    return "positive";
  } else {
    return "not positive";
  }
  // ここには到達しない
}

// パターンB: 一部の分岐でreturn
function example2(value) {
  if (value > 0) {
    return "positive";
  }
  // value <= 0 の場合はここも実行される
  console.log("check complete");
  return "not positive";
}

// パターンC: returnなし
function example3(value) {
  if (value > 0) {
    console.log("positive");
  } else {
    console.log("not positive");
  }
  // returnがないので、undefinedが返される
}
```

---

## より複雑なパターン

### パターン1: ネストしたif文（if文の中にif文）
```javascript
function checkUser(user) {
  if (user) {
    // 外側のif: userが存在するか
    if (user.age >= 18) {
      // 内側のif: 年齢が18以上か
      if (user.verified) {
        // さらに内側のif: 認証済みか
        return "フルアクセス";
      } else {
        return "制限付きアクセス";
      }
    } else {
      return "未成年";
    }
  } else {
    return "ユーザーなし";
  }
}

// 処理の流れ:
checkUser({age: 20, verified: true});
// 1. user が存在する → true
// 2. user.age >= 18 → true
// 3. user.verified → true
// 4. "フルアクセス" を返して終了

checkUser({age: 20, verified: false});
// 1. user が存在する → true
// 2. user.age >= 18 → true
// 3. user.verified → false
// 4. "制限付きアクセス" を返して終了
```

**ポイント:**
- ネストが深くなるほど読みにくくなる
- 早めにreturnして、ネストを浅くするのがベストプラクティス

**改善版（早期return）:**
```javascript
function checkUserBetter(user) {
  if (!user) return "ユーザーなし";
  if (user.age < 18) return "未成年";
  if (!user.verified) return "制限付きアクセス";
  return "フルアクセス";
}
// ↑ネストなしで同じ処理を実現
```

---

### パターン2: ループとbreak/continueの組み合わせ
```javascript
function findFirstEven(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
      continue; // 負の数はスキップ、次のループへ
    }
    
    if (numbers[i] % 2 === 0) {
      return numbers[i]; // 最初の偶数を見つけたら返して終了
    }
  }
  return null; // 見つからなかった場合
}

findFirstEven([1, 3, -4, 6, 8]);
// 処理の流れ:
// i=0: 1 → 負ではない、偶数でもない → 次へ
// i=1: 3 → 負ではない、偶数でもない → 次へ
// i=2: -4 → 負の数 → continue で次へ
// i=3: 6 → 負ではない、偶数 → 6 を返して終了
```

**break と continue の違い:**
```javascript
function demonstrateBreakContinue(numbers) {
  console.log("=== continue の例 ===");
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
      continue;
      // ※continueが実行された時点で、その下に書かれている処理は一切実行されず、次のループに進む。
      // 例えばこの下にif文やreturnがあっても、continueの後は無視される。これが「continue」の仕様。
    }
    console.log(numbers[i]);
  }
  
  console.log("=== break の例 ===");
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
      break; // ループ全体を終了
    }
    console.log(numbers[i]);
  }
}

demonstrateBreakContinue([1, 2, -3, 4, 5]);
// 出力:
// === continue の例 ===
// 1
// 2
// 4
// 5
// === break の例 ===
// 1
// 2
```

---

### パターン3: 複数のreturn、break、continueが複雑に絡む場合
```javascript
function processOrders(orders) {
  const validOrders = [];
  
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    
    // 早期returnチェック: 配列全体が不正
    if (!order) {
      console.log("不正な注文データ");
      return null;
    }
    
    // continueで特定の要素をスキップ
    if (order.cancelled) {
      console.log(`注文${order.id}はキャンセル済み`);
      continue; // この注文はスキップして次へ
    }
    
    // ネストしたif文で複雑な条件チェック
    if (order.amount > 0) {
      if (order.paid) {
        validOrders.push(order);
      } else {
        // 未払いの高額注文が見つかったら全体の処理を中断
        if (order.amount > 10000) {
          console.log("未払いの高額注文を発見");
          return null;
        }
        console.log(`注文${order.id}は未払い`);
      }
    } else {
      console.log(`注文${order.id}は金額が0以下`);
      continue;
    }
  }
  
  return validOrders;
}

// 使用例:
const orders = [
  {id: 1, amount: 100, paid: true, cancelled: false},
  {id: 2, amount: 200, paid: false, cancelled: false},
  {id: 3, amount: 300, paid: true, cancelled: true},
  {id: 4, amount: 15000, paid: false, cancelled: false}
];

processOrders(orders);
// 処理の流れ:
// 注文1: 有効 → validOrdersに追加
// 注文2: 未払いだが金額が10000以下 → スキップ
// 注文3: キャンセル済み → continue でスキップ
// 注文4: 未払いで金額が10000超え → null を返して終了
```

---

### パターン4: try-catch-finallyとif文の組み合わせ
```javascript
function processData(data) {
  try {
    if (!data) {
      throw new Error("データがありません");
    }
    
    if (data.type === "special") {
      if (data.value < 0) {
        throw new Error("値が負です");
      }
      return data.value * 2;
    } else {
      return data.value;
    }
  } catch (error) {
    console.log("エラー:", error.message);
    return null;
  } finally {
    // ここは必ず実行される（returnの後でも）
    console.log("処理完了");
  }
}

processData({type: "special", value: 10});
// 出力: "処理完了"
// 戻り値: 20

processData({type: "special", value: -5});
// 出力: "エラー: 値が負です"
// 出力: "処理完了"
// 戻り値: null

processData(null);
// 出力: "エラー: データがありません"
// 出力: "処理完了"
// 戻り値: null
```

---

### パターン5: switch文とif文の組み合わせ
```javascript
function handleAction(action, value) {
  switch (action) {
    case "add":
      if (value > 0) {
        return `追加: ${value}`;
      } else {
        return "エラー: 追加する値は正でなければなりません";
      }
      break; // ↑でreturnしているので、ここには到達しない
      
    case "remove":
      if (value > 0) {
        return `削除: ${value}`;
      }
      // if文がfalseの場合、breakがないので次のcaseに流れる（フォールスルー）
      
    case "reset":
      return "リセット";
      
    default:
      if (value !== undefined) {
        return `不明なアクション: ${action}`;
      }
      return "不明なアクション";
  }
}

handleAction("add", 10);    // "追加: 10"
handleAction("add", -5);    // "エラー: 追加する値は正でなければなりません"
handleAction("remove", 10); // "削除: 10"
handleAction("remove", -5); // "リセット" (フォールスルー)
```

---

## 制御構文まとめ

### return
- 関数をその場で終了し、値を返す
- 以降のコードは実行されない

### break
- ループ（for, while）やswitch文を終了する
- ループの外の次の処理に進む

### continue
- 現在のループ処理だけスキップ
- 次のループ処理に進む（ループ自体は終了しない）

### 処理の優先順位
1. **return** → 関数全体を終了（最強）
2. **break** → ループ/switch文を終了
3. **continue** → 現在のループだけスキップ
4. **通常の処理** → 次の行に進む

---

## まとめ

- **if文は上から順に条件を評価し、最初にtrueになった分岐を実行する**
- **returnがあれば、その時点で関数終了（以降の処理は実行されない）**
- **returnがなければ、次の処理に進む**
- **else ifは、前の条件がfalseの時だけ評価される**
- **returnがない関数は、undefinedを返す**
- **値を返す関数では、全ての分岐でreturnに到達するように書くのがベストプラクティス**
- **ネストが深くなる場合は、早期returnでネストを浅くする**
- **breakはループ/switch全体を終了、continueは現在のループだけスキップ**
- **finallyブロックは、returnの後でも必ず実行される**

この仕様を理解すれば、どんな複雑なif文でも読めるようになります。
