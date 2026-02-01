# beforeDestroy() 完全ガイド

## beforeDestroy() とは

**Vueコンポーネントが破棄される直前に実行されるライフサイクルフック**

コンポーネントのお片付け処理を書く場所。

---

## ライフサイクルの流れ

```javascript
created()       // コンポーネント作成
↓
mounted()       // 画面に表示された（DOM操作可能）
↓
（ユーザーが操作、コンポーネント使用中）
↓
beforeDestroy() // これから破棄する ← ここ！
↓
destroyed()     // 破棄完了
```

### いつ実行される？

- ページ遷移したとき
- `v-if="false"` でコンポーネントが非表示になったとき
- 親コンポーネントが破棄されたとき

---

## なぜ必要？

### メモリリーク防止のため

**メモリリーク = メモリが無駄に使われ続けて解放されない状態**

```
メモリリークの例：
1回目のページ表示: リスナー登録 → メモリ10MB使用
2回目のページ表示: リスナー登録 → メモリ20MB使用（前のが残ってる）
3回目のページ表示: リスナー登録 → メモリ30MB使用
...
↓
ブラウザのメモリ使用量が増え続ける
↓
ブラウザが重くなる、最悪クラッシュ ❌
```

**beforeDestroyで解放すれば**:

```
1回目: 10MB使用 → 10MB解放 → 0MB
2回目: 10MB使用 → 10MB解放 → 0MB
3回目: 10MB使用 → 10MB解放 → 0MB
↓
メモリ使用量が一定 ✅
```

---

## いつbeforeDestroyが必要？

### ✅ beforeDestroy必要 = リスナー登録・継続的な処理

| mounted()で何をしたか | beforeDestroy()で何をするか | 理由 |
|---------------------|---------------------------|------|
| `$on()` でイベント登録 | `$off()` で解除 | リスナーが残り続ける |
| `addEventListener()` | `removeEventListener()` | リスナーが残り続ける |
| `setInterval()` | `clearInterval()` | 永遠に実行され続ける |
| `setTimeout()`（ID保存） | `clearTimeout()` | 長時間タイマーが残る |
| `new WebSocket()` | `.close()` | 接続が残り続ける |
| `new IntersectionObserver()` | `.disconnect()` | 監視が残り続ける |
| サードパーティライブラリ | `.destroy()` | インスタンスが残る |

### ❌ beforeDestroy不要 = 自動で片付くもの

| mounted()で何をしたか | beforeDestroy必要？ | 理由 |
|---------------------|-------------------|------|
| `$store.dispatch()` | ❌ 不要 | Vuexが管理してくれる |
| `$axios.get()` | ❌ 不要 | 処理完了で自動終了 |
| `this.xxx = 値` | ❌ 不要 | コンポーネントと一緒に消える |
| `console.log()` | ❌ 不要 | 何も残らない |
| `setTimeout()`（IDなし、短時間） | ❌ 不要 | 数秒で自動終了 |

---

## 実装パターン集

### パターン1: $on/$off（グローバルイベントバス）

**最頻出パターン**

```javascript
export default {
  mounted() {
    // イベントリスナーを登録
    this.$nuxt.$on('show-toast', this.handleToast);
  },
  beforeDestroy() {
    // イベントリスナーを解除 ← 必須！
    this.$nuxt.$off('show-toast', this.handleToast);
  },
  methods: {
    handleToast({ type, message }) {
      // 処理
    }
  }
}
```

**解除しないと何が起こる？**

```
1. ページA表示 → リスナー登録（1個目）
2. ページB遷移 → リスナー残る
3. ページA表示 → リスナー登録（2個目）
4. イベント発火 → 2回実行される！❌
5. 繰り返すと3回、4回...と増える
```

---

### パターン2: addEventListener/removeEventListener

```javascript
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },
  methods: {
    handleResize() {
      console.log('リサイズされた');
    },
    handleClick() {
      console.log('クリックされた');
    }
  }
}
```

**注意**: メソッドを直接参照すること（`this.handleResize`）。アロー関数だと解除できない。

---

### パターン3: setInterval/clearInterval

```javascript
export default {
  data() {
    return {
      intervalId: null,
      count: 0
    };
  },
  mounted() {
    // 1秒ごとに実行
    this.intervalId = setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  },
  beforeDestroy() {
    // 必ず停止する ← 永遠に実行され続けるため
    clearInterval(this.intervalId);
  }
}
```

**setIntervalは必ずbeforeDestroyで停止すること！**

---

### パターン4: setTimeout（ID保存、長時間）

```javascript
export default {
  data() {
    return {
      timerId: null
    };
  },
  mounted() {
    // 10秒後に実行
    this.timerId = setTimeout(() => {
      console.log('10秒経過');
    }, 10000);
  },
  beforeDestroy() {
    // タイマーをキャンセル
    clearTimeout(this.timerId);
  }
}
```

**短時間（数秒）でIDを保存していない場合は不要**:

```javascript
mounted() {
  // これはbeforeDestroy不要
  setTimeout(() => {
    console.log('3秒後');
  }, 3000);
}
// ↑ IDを保存してない、3秒で自動終了 → clearTimeout不要
```

---

### パターン5: WebSocket

```javascript
export default {
  data() {
    return {
      socket: null
    };
  },
  mounted() {
    this.socket = new WebSocket('ws://example.com');
    
    this.socket.onmessage = (event) => {
      console.log(event.data);
    };
    
    this.socket.onerror = (error) => {
      console.error(error);
    };
  },
  beforeDestroy() {
    // 接続を切断
    if (this.socket) {
      this.socket.close();
    }
  }
}
```

---

### パターン6: IntersectionObserver（スクロール監視）

```javascript
export default {
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('要素が画面に入った');
        }
      });
    });
    
    this.observer.observe(this.$refs.target);
  },
  beforeDestroy() {
    // 監視を停止
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
```

---

### パターン7: サードパーティライブラリ

```javascript
import Swiper from 'swiper';
import Chart from 'chart.js';

export default {
  data() {
    return {
      swiper: null,
      chart: null
    };
  },
  mounted() {
    // Swiper初期化
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 3,
      spaceBetween: 30
    });
    
    // Chart.js初期化
    this.chart = new Chart(this.$refs.canvas, {
      type: 'bar',
      data: { /* データ */ }
    });
  },
  beforeDestroy() {
    // インスタンスを破棄
    if (this.swiper) {
      this.swiper.destroy();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
```

**ライブラリごとに破棄メソッドが違う**（ドキュメント確認必須）

---

## リスナー登録とは

**リスナー登録 = 「このイベントが起きたら、この処理を実行して」と予約すること**

### リスナー登録ではない（普通の関数呼び出し）

```javascript
// 今すぐ実行して終わり
this.$store.dispatch('fetchUsers');
// → 実行完了 → 終わり ✅

this.$axios.get('/api/users');
// → データ取得 → 終わり ✅

console.log('こんにちは');
// → 表示 → 終わり ✅
```

### リスナー登録（イベントを待ち続ける）

```javascript
// イベントを待ち続ける（解除するまで永遠に）
this.$nuxt.$on('show-toast', () => {
  console.log('イベント発生！');
});
// → 待機中... → イベント来た → 実行 → また待機... → イベント来た → 実行...
// ↑ 解除しない限り永遠に待ち続ける ❌

window.addEventListener('click', () => {
  console.log('クリックされた');
});
// → クリック待機中... → クリック → 実行 → また待機...
// ↑ 解除しない限り永遠に待ち続ける ❌
```

**リスナー = イベント待ち受け係、解除しないと永遠に待ち続ける**

---

## 実際のコード例（Toast実装）

```javascript
// components/toast.vue
export default {
  name: "Toast",
  data() {
    return {
      toasts: []
    };
  },
  mounted() {
    // イベントリスナーを登録 ← グローバルに残る
    this.$nuxt.$on('show-toast', ({ type, message }) => {
      const id = Date.now();
      this.toasts.unshift({ id, type, message });

      // 3秒後に自動削除（IDなし、短時間 → clearTimeout不要）
      setTimeout(() => {
        this.closeToast(id);
      }, 3000);
    });
  },
  beforeDestroy() {
    // イベントリスナーを解除 ← 必須！
    this.$nuxt.$off('show-toast');
  },
  methods: {
    closeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    }
  }
}
```

**このコードのポイント**:
- `$on` でリスナー登録 → `beforeDestroy` で `$off` が必要 ✅
- `setTimeout` はIDなし、3秒で終わる → `clearTimeout` 不要 ✅

---

## よくある質問

### Q1: なぜ今まで書いたことないの？

**A**: 今までの `mounted()` は自動で片付くものばかりだったから

```javascript
// これまでのパターン（beforeDestroy不要）
mounted() {
  this.$axios.get('/api/users').then(res => {
    this.users = res.data;  // dataに保存
  });
  
  this.$store.dispatch('fetchUserInfo');
}
// → 自動で片付く、何もしなくてOK
```

**今回初めて `$on` を使った = リスナー登録 = beforeDestroy必要**

---

### Q2: setTimeout使ってもbeforeDestroy書いてないこともあるけど？

**A**: 短時間（数秒）でIDを保存していない場合は不要

```javascript
// ❌ clearTimeout必要
data() {
  return { timerId: null };
},
mounted() {
  this.timerId = setTimeout(() => {
    console.log('10秒後');
  }, 10000);  // 長時間 + ID保存
}
beforeDestroy() {
  clearTimeout(this.timerId);  // 必須！
}

// ✅ clearTimeout不要
mounted() {
  setTimeout(() => {
    console.log('3秒後');
  }, 3000);  // 短時間、IDなし
}
// → clearTimeout不要
```

---

### Q3: storeもコンポーネント外だけど、なぜbeforeDestroy不要？

**A**: Vuexが自動で管理してくれるから

```javascript
// store呼び出し → Vuexが管理
this.$store.dispatch('fetchUsers');
// → 処理完了で自動終了、リスナー登録ではない

// $on → 自分で管理が必要
this.$nuxt.$on('show-toast', ...);
// → リスナー登録、手動で解除しないと残る
```

**判断基準**: 「リスナー登録」「継続的な処理」ならbeforeDestroy必要

---

### Q4: メモリリークって情報漏洩のこと？

**A**: 全く違う。メモリが無駄に使われ続けること

```
メモリリーク = 掃除しないゴミ屋敷

情報漏洩 = 秘密が外部に漏れる
```

**メモリリークの影響**:
- 短期間: 影響なし
- 長時間使用: ブラウザが徐々に重くなる
- 何時間も使用: ブラウザがクラッシュする可能性

---

## 判断フローチャート

```
mounted()で何かした
↓
リスナーを登録した？
├─ YES → beforeDestroyで解除必要 ✅
│        ($on, addEventListener, etc.)
│
└─ NO → 継続的な処理を開始した？
        ├─ YES → beforeDestroyで停止必要 ✅
        │        (setInterval, WebSocket, etc.)
        │
        └─ NO → beforeDestroy不要 ❌
                 (axios, store.dispatch, データ代入, etc.)
```

---

## まとめ

### 覚えるべきこと

1. **beforeDestroy = コンポーネント破棄直前に実行されるお片付け処理**

2. **必要なケース = リスナー登録、継続的な処理**
   - `$on` → `$off`
   - `addEventListener` → `removeEventListener`
   - `setInterval` → `clearInterval`
   - `setTimeout`（ID保存、長時間） → `clearTimeout`
   - `new WebSocket()` → `.close()`
   - `new Observer()` → `.disconnect()`
   - ライブラリ → `.destroy()`

3. **不要なケース = 自動で片付くもの**
   - `$store.dispatch()`
   - `$axios.get()`
   - `this.xxx = 値`
   - `console.log()`
   - `setTimeout()`（IDなし、短時間）

4. **理由 = メモリリーク防止**
   - リスナーが残り続ける
   - メモリが無駄に使われる
   - ブラウザが重くなる

5. **シンプルな判断基準**
   - 「〇〇を登録した」「〇〇を開始した」→ beforeDestroyで解除/停止
   - 「〇〇を呼び出した」「〇〇を取得した」→ beforeDestroy不要

### 実装の鉄則

**mounted()で開始したものは、beforeDestroy()で必ず片付ける！**

```javascript
mounted() {
  // 何かを開始
  this.$nuxt.$on('event', ...);
},
beforeDestroy() {
  // 必ず片付ける
  this.$nuxt.$off('event');
}
```

これを守れば、メモリリークは起きません。
