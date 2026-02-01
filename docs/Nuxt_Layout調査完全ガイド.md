# Nuxt.js Layout調査完全ガイド

## 目次
1. [基礎知識](#基礎知識)
2. [よくある混乱ポイント](#よくある混乱ポイント)
3. [調査手順（全パターン）](#調査手順全パターン)
4. [実務での調査フロー](#実務での調査フロー)
5. [トラブルシューティング](#トラブルシューティング)
6. [チェックリスト](#チェックリスト)

---

## 基礎知識

### Nuxtの仕組み（重要）

#### 1. layoutファイルは「枠組み」
```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <Header />
    <nuxt />        ← ここに pages/ の内容が差し込まれる
    <Footer />
  </div>
</template>
```

#### 2. pagesファイルは「中身」
```vue
<!-- pages/0302.vue -->
<template>
  <div>
    <h1>ユーザー管理画面</h1>
    <!-- 実際の画面内容 -->
  </div>
</template>
```

#### 3. 合成結果（実際に表示される）
```html
<div>
  <Header />
  <div>
    <h1>ユーザー管理画面</h1>
  </div>
  <Footer />
</div>
```

---

### **重要な事実（絶対に覚える）**

#### ❌ layoutファイルは「importされない」
```vue
<!-- どこにもこういう記述はない -->
import DefaultLayout from '~/layouts/default.vue'
```

#### ❌ pagesファイルも「importされない」
```vue
<!-- どこにもこういう記述はない -->
import UserPage from '~/pages/0302.vue'
```

#### ✅ Nuxtが自動で読み込む
- `pages/` フォルダを自動スキャン
- `layouts/` フォルダを自動スキャン
- ファイルパスとURLを自動マッピング

**だから `import` で検索しても見つからない = 正常**

---

## よくある混乱ポイント

### 混乱1: 「このlayoutファイルはどこでimportされてるんだ？」

**答え: importされない。Nuxtが自動で読み込む。**

### 混乱2: 「pages/0302.vueはどこでimportされてるんだ？」

**答え: importされない。ファイルパス=URLのルールで自動マッピング。**

### 混乱3: 「じゃあどうやって使われてるか調べるんだ？」

**答え: 以下の調査手順を使う。**

---

### 混乱4: 「index.vueに辿り着くと実際の画面ファイルが分からなくなる」（超重要）

#### よくあるパターン

**パターンA: layouts/admin/index.vue に辿り着いた**
```vue
<!-- layouts/admin/index.vue -->
<template>
  <div>
    <Header />
    <nuxt />  ← 中身がない？
    <Footer />
  </div>
</template>
```

**間違った理解:**
```
「実際の画面内容がない！実際の画面ファイルはどこだ？」
```

**正しい理解:**
```
これは「枠組み」であって、実際の画面ではない。
実際の画面は pages/ ディレクトリにある。
```

**次にやること:**
```
このlayoutを使っているpagesを探す
↓
検索: layout:\s*['"]admin
対象: pages/**/*.vue
```

---

**パターンB: pages/admin/index.vue に辿り着いた**
```vue
<!-- pages/admin/index.vue -->
<template>
  <div>
    <h1>管理画面トップ</h1>
    <ul>
      <li>ユーザー管理</li>
      <li>商品管理</li>
    </ul>
  </div>
</template>
```

**間違った理解:**
```
「index.vueだから入口ページでしょ？実際の画面は別にあるはず」
```

**正しい理解:**
```
これが実際の画面そのもの。これ以上探す必要はない。
pages/admin/index.vue = /admin のURL
```

---

#### 見分け方（超重要）

**質問: 今開いているindex.vueが layouts と pages のどっちか分からない**

**STEP 1: ファイルパスを見る**
```
VSCodeの上部タブ、またはエクスプローラーのパスを確認

layouts/admin/index.vue  ← layoutsなら「枠組み」
pages/admin/index.vue    ← pagesなら「実際の画面」
```

**STEP 2: ファイルの中身を見る**

layoutsの特徴:
```vue
<template>
  <div>
    <Header />
    <nuxt />  ← これがあったらlayouts
    <Footer />
  </div>
</template>
```

pagesの特徴:
```vue
<template>
  <div>
    <h1>〇〇画面</h1>  ← 実際の画面内容が書いてある
    <!-- 具体的な画面内容 -->
  </div>
</template>

<script>
export default {
  layout: 'admin/index'  ← layout指定がある（layoutsにはない）
}
</script>
```

---

#### 実際の調査フロー

**シナリオ: 検索で index.vue に辿り着いた**

**STEP 1: パスを確認**
```
パス: layouts/admin/index.vue
↓
これは枠組み
↓
実際の画面は pages/ にある
↓
STEP 2へ
```

```
パス: pages/admin/index.vue
↓
これが実際の画面
↓
調査完了（URLは /admin）
```

**STEP 2: layoutsの場合、pagesを探す**
```
Ctrl + Shift + F
検索: layout:\s*['"]admin
対象: pages/**/*.vue
正規表現: ON
```

結果例:
```
pages/0302.vue
pages/0402.vue
pages/0502.vue
```

これらが layouts/admin/index.vue を使う実際の画面ファイル。

---

#### まとめ

**index.vueには2種類ある:**

```
layouts/xxx/index.vue  ← 枠組み（実際の画面ではない）
  ↓ この中の <nuxt /> に差し込まれる
pages/xxx/index.vue  ← 実際の画面（これが最終地点）
```

**混乱の原因:**
```
どちらも「index.vue」という名前
→ 区別がつかない
→ layoutsのindex.vueを「実際の画面」と勘違い
→ 「実際の画面が見つからない」と迷う
```

**解決方法:**
```
1. パスを見る（layouts か pages か）
2. 中身を見る（<nuxt /> があるか、layout指定があるか）
3. layoutsなら → pagesを探す
4. pagesなら → これが答え
```

---

## 調査手順（全パターン）

### パターン1: 「このpagesファイルがどのlayoutを使うか調べる」

#### 手順1: pagesファイルを開く
```vue
<!-- pages/0302.vue -->
<script>
export default {
  layout: 'admin/index'  ← ここに書いてあればOK
}
</script>
```

#### 手順2: 書いてない場合の確認順序（重要）

**状況: `layout: 'xxx'` が書かれていない**

**❌ 間違った結論:**
```
layout指定なし = layouts/default.vue 確定
```

**✅ 正しい確認順序:**
```
1. まず middleware/ を確認（大規模プロジェクトでは必須）
2. middlewareにもなければ default.vue
```

---

**なぜこの順序？**

**大規模プロジェクト（10万行規模）の場合:**
```
layout: 'xxx' が書かれていないファイルが頻発
↓
middlewareで一括設定している可能性が高い
↓
middlewareを確認せずに「default.vueだ」と決めつけるのは危険
```

**小規模プロジェクトの場合:**
```
ほとんどのファイルに layout: 'xxx' が書いてある
↓
middlewareは使われていない
↓
layout指定なし = default.vue で正解
```

---

#### 手順3: middlewareで動的設定されているかも（最優先で確認）
```
対象: middleware/*.js
検索: layout
```

例:
```js
// middleware/setLayout.js
export default function ({ route }) {
  if (route.path.startsWith('/admin')) {
    route.meta.layout = 'admin/index'
  }
}
```

---

#### middlewareでlayout設定するメリット（補足）

**疑問: 「pages内で layout: 'xxx' と書けば済むのに、なぜわざわざmiddlewareで設定するのか？」**

**答え: 大規模プロジェクトで保守性を高めるため**

---

**メリット1: 大量のファイルへの一括設定**

middlewareなしの場合（各ファイルに書く）:
```vue
<!-- pages/admin/users.vue -->
<script>
export default { layout: 'admin' }
</script>

<!-- pages/admin/products.vue -->
<script>
export default { layout: 'admin' }
</script>

<!-- pages/admin/orders.vue -->
<script>
export default { layout: 'admin' }
</script>

<!-- 50ファイルあったら50回書く必要がある -->
```

middlewareありの場合（1箇所だけ）:
```js
// middleware/adminLayout.js
export default function ({ route }) {
  if (route.path.startsWith('/admin')) {
    return 'admin'
  }
}
```

→ `pages/admin/` 以下の全ファイルで自動適用される

---

**メリット2: 書き忘れ防止**

middlewareなしの場合:
```vue
<!-- pages/admin/newpage.vue -->
<script>
export default {
  // layout書き忘れ！
}
</script>
```
→ `layouts/default.vue` が使われて見た目がおかしくなる

middlewareありの場合:
```
新しいページを pages/admin/ に追加
↓
自動的に admin レイアウトが適用される
↓
書き忘れが起きない
```

---

**メリット3: 複雑な条件分岐の一元管理**

```js
// middleware/layoutSelector.js
export default function ({ route, store }) {
  // ログインしてない → guestレイアウト
  if (!store.state.isLoggedIn) {
    return 'guest'
  }
  
  // 管理者 → adminレイアウト
  if (store.getters.isAdmin) {
    return 'admin'
  }
  
  // モバイル → mobileレイアウト
  if (store.state.isMobile) {
    return 'mobile'
  }
  
  // それ以外 → defaultレイアウト
  return 'default'
}
```

これを各pagesファイルに書くのは地獄 → middlewareで一元管理

---

**メリット4: ビジネスロジックの集約**

```js
// middleware/dynamicLayout.js
export default function ({ route, store }) {
  // URLパターンで判定
  if (route.path.startsWith('/admin')) return 'admin'
  if (route.path.startsWith('/shop')) return 'shop'
  if (route.path.startsWith('/blog')) return 'blog'
  
  // ユーザー権限で判定
  if (store.state.user.isPremium) return 'premium'
  
  // デバイスで判定
  if (process.client && window.innerWidth < 768) return 'mobile'
  
  return 'default'
}
```

---

**まとめ: middlewareはいつ使う？**

**middlewareで設定する場合:**
- ✅ 大量のpagesファイルに同じlayoutを適用する
- ✅ 条件分岐が複雑（権限、デバイス、URL）
- ✅ 書き忘れを防ぐ
- ✅ ビジネスロジックを一元管理

**pages内で直接指定する場合:**
- ✅ そのページだけ特別なlayoutを使う
- ✅ シンプルなプロジェクト
- ✅ 明示的に分かりやすくしたい

**実務では:** 大規模プロジェクトほどmiddlewareの方が**保守しやすい**。

---

#### 手順4: 実行して確認（最終手段）
```vue
<!-- pages/0302.vue に追加 -->
<script>
export default {
  mounted() {
    console.log('使用中のlayout:', this.$nuxt.layout || this.$options.layout || 'default')
    console.log('現在のURL:', this.$route.path)
  }
}
</script>
```

開発サーバーで実行 → ブラウザのコンソールで確認

---

### パターン2: 「このlayoutファイルを使っているpagesを全部探す」

#### 手順1: layoutファイル名を確認
```
layouts/admin/index.vue
```
↓
指定名は `admin/index` または `admin`（indexは省略可能）

#### 手順2: VSCodeで検索
```
Ctrl + Shift + F

検索1: layout:\s*['"]admin/index['"]
検索2: layout:\s*['"]admin['"]

正規表現: ON
対象: pages/**/*.vue
```

#### 手順3: middlewareも確認
```
対象: middleware/*.js
検索: admin
```

#### 手順4: nuxt.config.jsも確認
```
対象: nuxt.config.js
検索: admin
```

#### 手順5: 結果の整理
- ヒットしたファイル = このlayoutを使っている
- ヒット0件 = 使われていない or 動的設定

---

### パターン3: 「URLからファイルを特定する」（innerRouterなし）

#### Nuxtのデフォルトルール
```
URL: /admin/users
↓
ファイル: pages/admin/users.vue
または: pages/admin/users/index.vue
```

#### 確認方法
```
pages/
  admin/
    users.vue  ← /admin/users
    users/
      index.vue  ← /admin/users（同じ）
```

---

### パターン4: 「URLからファイルを特定する」（innerRouterあり）

#### 手順1: innerRouterファイルを探す
```
よくある場所:
- router/innerRouter.js
- router/routes.js
- config/routes.js
```

VSCode検索:
```
検索: innerRouter
対象: **/*.js
```

#### 手順2: innerRouterを開く
```js
// router/innerRouter.js（例）
export default [
  {
    path: '/admin/user-management',
    component: '0302',  // pages/0302.vue
    layout: 'admin/index'
  },
  {
    path: '/admin/product-list',
    component: '0703',
    layout: 'admin/index'
  }
]
```

#### 手順3: URLで検索
```
Ctrl + F
検索: /admin/user-management
```

→ component: '0302' → pages/0302.vue

#### 手順4: pathやlayoutが書いてない場合
innerRouterが省略形や動的生成の場合は `.nuxt/router.js` を見る（後述）

---

### パターン5: 「ファイルからURLを特定する」（innerRouterあり）

#### 手順1: innerRouterを開く

#### 手順2: ファイル名で検索
```
対象: router/innerRouter.js
検索: '0302'
または: 0302
```

#### 手順3: pathを確認
```js
{
  path: '/admin/user-management',  ← このURL
  component: '0302'
}
```

---

### パターン6: 「.nuxt/router.js を使う」（最終兵器）

#### これは何？
- Nuxtが**完全自動生成**する最終的なルート定義
- innerRouterやnuxt.config.jsの設定が全部適用済み
- **これが真実**

#### 重要な特徴
- ✅ 誰も手書きしていない（100%自動生成）
- ✅ `npm run dev` または `npm run build` で毎回生成される
- ❌ **編集しても無駄**（次回起動時に上書きされる）
- ✅ 読み取り専用として扱う
- ✅ `.gitignore` に入っている（Gitで管理されない）

#### 場所
```
プロジェクトルート/.nuxt/router.js
```

#### .nuxtフォルダとは？
```
.nuxt/
  router.js           ← これが重要（ルート定義）
  index.js
  client.js
  server.js
  routes.json
  components/         ← 大量の自動生成ファイル
    index.js
    nuxt-child.js
    nuxt-error.vue
    ...（何百個もある）
  views/
  middleware/
  store/
  ...（数千のファイルが詰まっている）
```

**特徴:**
- ✅ **全てNuxtが自動生成**（誰も手書きしていない）
- ✅ 開発サーバー起動時に作られる
- ✅ 何千ものファイルがある
- ✅ `.gitignore` に入っている（Git管理しない）
- ❌ **絶対に手で編集しない**
- ✅ 削除しても次回起動時にまた作られる

**調査で使うのは:**
```
.nuxt/router.js  ← これだけ見ればOK
```

**他のファイルは見なくていい。内部処理用。**

#### 生成タイミング
```
npm run dev を実行
↓
Nuxtが pages/ を読み込む
↓
innerRouter や nuxt.config.js を適用
↓
.nuxt/router.js を自動生成
↓
アプリが起動
```

**サーバーを停止して再起動すると、また自動生成される**

#### 使い方
```js
// .nuxt/router.js
import _7c8a9b0c from '../pages/0302.vue'
import _3f2a1d8e from '../pages/0703.vue'

export function createRouter() {
  return new Router({
    routes: [
      {
        path: "/admin/user-management",
        component: _7c8a9b0c,  // pages/0302.vue
        name: "admin-user-management"
      },
      {
        path: "/admin/product-list",
        component: _3f2a1d8e,  // pages/0703.vue
        name: "admin-product-list"
      }
    ]
  })
}
```

#### 調査手順
1. `.nuxt/router.js` を開く
2. `Ctrl + F` でファイル名を検索（例: `0302`）
3. import文を見る → `import _xxx from '../pages/0302.vue'`
4. routesを見る → `path: "/admin/user-management"`

**結果: pages/0302.vue = /admin/user-management**

#### 具体的な確認方法（画面操作レベル）

**STEP 1: .nuxt/router.jsを開く**
```
VSCode左側のエクスプローラーで
.nuxt フォルダを展開
↓
router.js をクリック
```

**STEP 2: ファイル名で検索**
```
Ctrl + F（検索窓が開く）
↓
「0302」と入力してEnter
↓
該当箇所がハイライトされる
```

**STEP 3: 見つかった箇所を確認**
```js
// ファイルの上の方でimport文が見つかる
import _7c8a9b0c from '../pages/0302.vue'  ← これが0302.vueのこと
```

**STEP 4: その変数名をさらに検索**
```
Ctrl + F で「_7c8a9b0c」を検索
↓
routes配列の中で見つかる
```

**STEP 5: pathプロパティを読む**
```js
routes: [
  {
    path: "/admin/user-management",  ← これがURL
    component: _7c8a9b0c,             ← これが0302.vue
    name: "admin-user-management"
  }
]
```

**path: "/admin/user-management"** の意味:
- `path` = URLのパス部分
- `/admin/user-management` = ブラウザで `http://example.com/admin/user-management` にアクセスした時
- このページが表示される

**結論:**
```
pages/0302.vue は /admin/user-management のURLで表示される
```

#### 実例（画像で想像して）

```
.nuxt/router.js を開く
↓
Ctrl + F → 「0302」で検索
↓
見つかる場所（例）:

1行目付近:
import _abc123 from '../pages/0302.vue'
                          ↑
                    これが0302.vue

50行目付近:
{
  path: "/admin/user-management",  ← これを読む
  component: _abc123,               ← これが0302.vue
  name: "admin-user-management"
}

読み取り結果:
pages/0302.vue = URL: /admin/user-management
```

#### pathとは何か？

**path（パス）** = URLのドメインより後ろの部分

例:
```
URL全体: https://example.com/admin/user-management
                            ↑
                        これがpath: /admin/user-management

URL全体: https://example.com/shop/products
                            ↑
                        これがpath: /shop/products
```

**router.jsに書かれているのは、このpath部分**

#### 注意
- layoutは書かれていない → pagesファイルを開いて確認

---

### パターン7: 「layoutにimportされているコンポーネントを追跡」

#### 状況
```vue
<!-- layouts/admin/index.vue -->
<script>
import AdminHeader from '~/components/AdminHeader.vue'
import AdminModal from '~/components/AdminModal.vue'
</script>
```

#### 質問: このlayoutを使うページでAdminModalが使えるか？

**答え: 使える。**

layoutにimportされているコンポーネントは、そのlayoutを使う**全ページで自動的に利用可能**。

#### pages側でimportしなくても使える
```vue
<!-- pages/0302.vue -->
<template>
  <div>
    <AdminModal />  ← layoutでimportされているので使える
  </div>
</template>

<script>
export default {
  // AdminModalをimportしていない！
  layout: 'admin/index'
}
</script>
```

---

## 実務での調査フロー

### ケース1: 「pages/0302.vueが何の画面か調べる」

#### STEP 1: ファイルを開いて中身を読む
```vue
<!-- pages/0302.vue -->
<template>
  <div>
    <h1>ユーザー管理画面</h1>  ← これで分かる
```

または

```vue
<script>
export default {
  name: 'UserManagementScreen',  ← これで分かる
  head() {
    return {
      title: 'ユーザー管理'  ← これでも分かる
    }
  }
}
</script>
```

#### STEP 2: API呼び出しから推測
```vue
<script>
export default {
  async fetch() {
    this.users = await this.$axios.get('/api/users')  ← ユーザー系
  }
}
</script>
```

#### STEP 3: 変数名から推測
```vue
<script>
data() {
  return {
    userList: [],  ← ユーザー系
    selectedUser: null
  }
}
</script>
```

#### STEP 4: コメントを確認
```vue
<!--
  画面名: ユーザー管理画面
  URL: /admin/user-management
-->
```

---

### ケース2: 「pages/0302.vueがどのURLで表示されるか調べる」

#### STEP 1: innerRouterを確認
```
対象: router/innerRouter.js
検索: '0302'
```

#### STEP 2: .nuxt/router.jsを確認
```
対象: .nuxt/router.js
検索: 0302
```

#### STEP 3: デフォルトルールを適用
```
pages/0302.vue → /0302
```

---

### ケース3: 「pages/0302.vueがどのlayoutを使うか調べる」

#### STEP 1: ファイルを開く
```vue
<script>
export default {
  layout: 'admin/index'  ← あればOK
}
</script>
```

#### STEP 2: なければmiddleware確認
```
対象: middleware/*.js
検索: layout
```

#### STEP 3: なければdefault.vueと判断
```
layout指定なし = layouts/default.vue
```

#### STEP 4: 実行して確認
```vue
<script>
export default {
  mounted() {
    console.log('Layout:', this.$nuxt.layout || 'default')
  }
}
</script>
```

---

### ケース4: 「layouts/admin/index.vueを使っているページを全部探す」

#### STEP 1: VSCode検索
```
検索: layout:\s*['"]admin/index['"]
または: layout:\s*['"]admin['"]
対象: pages/**/*.vue
```

#### STEP 2: middleware確認
```
対象: middleware/*.js
検索: admin
```

#### STEP 3: innerRouter確認
```
対象: router/innerRouter.js
検索: admin
```

#### STEP 4: 結果をリスト化
```
見つかったファイル:
- pages/0302.vue
- pages/0402.vue
- pages/0502.vue

→ これら全てが layouts/admin/index.vue を使っている
```

---

#### よくあるハマりポイント: 「pages/index.vueしか見つからない、でもimportが何もない」

**状況:**
```
検索結果: pages/index.vue だけヒット
↓
pages/index.vue を開く
↓
<template>
  <div>
    <h1>トップページ</h1>
  </div>
</template>

<script>
export default {
  layout: 'admin/index'
  // 他に何もimportされていない
}
</script>

「実際の画面ファイルがない？」← ここで詰む
```

**答え: pages/index.vue 自体が実際の画面ファイル**

#### 重要な理解

**❌ 間違った考え方:**
```
pages/index.vue は「何かをimportする場所」
実際の画面は別のファイル
```

**✅ 正しい考え方:**
```
pages/index.vue = 実際の画面そのもの
これが最終地点
```

#### 確認方法

**STEP 1: pages/index.vue の中身を見る**
```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>トップページ</h1>  ← これが実際の画面内容
    <UserList />           ← コンポーネントを使っている
  </div>
</template>

<script>
import UserList from '~/components/UserList.vue'  ← これは通常のimport
export default {
  layout: 'admin/index',
  components: { UserList }
}
</script>
```

**STEP 2: このページがどのURLで表示されるか確認**

方法1: ファイルパスから推測
```
pages/index.vue → URL: / (トップページ)
pages/admin/index.vue → URL: /admin
pages/user/index.vue → URL: /user
```

方法2: .nuxt/router.js で確認
```
対象: .nuxt/router.js
検索: pages/index.vue
```

```js
// .nuxt/router.js
{
  path: "/",  ← このURL
  component: _xxx,  // pages/index.vue
  name: "index"
}
```

**STEP 3: 実際に確認**
```
npm run dev を実行
↓
http://localhost:3000/ にアクセス
↓
pages/index.vue の内容が表示される
```

#### まとめ

**pagesファイルは「実際の画面」そのもの**

```
layouts/admin/index.vue  ← 枠組み（ヘッダー・フッター）
  ↓ この中の <nuxt /> に差し込まれる
pages/index.vue  ← 実際の画面内容（これが最終地点）
```

**「この先」はない。pages/index.vueが答え。**

#### 調査完了の判断基準

```
✅ pages/index.vue が見つかった
✅ <template> に画面内容が書いてある
✅ layout指定を確認した

→ 調査完了

やることリスト:
□ pages/index.vue がどのURL? → ファイルパスまたは.nuxt/router.jsで確認
□ どんな画面? → <template>の中身とh1タグ、コメントで確認
□ どのlayout? → layout: 'admin/index' で確認済み
```

---

### ケース5: 「layoutにimportされているモーダルがどのページで使えるか」

#### STEP 1: layoutを特定
```vue
<!-- layouts/admin/index.vue -->
<script>
import ConfirmModal from '~/components/ConfirmModal.vue'
</script>
```

#### STEP 2: このlayoutを使うページを全検索
```
検索: layout:\s*['"]admin
対象: pages/**/*.vue
```

#### STEP 3: 結果
```
見つかったページ全てで ConfirmModal が使える
```

---

## トラブルシューティング

### 問題1: 「layoutファイルが見つからない」

#### 原因1: 指定が間違っている
```vue
<script>
export default {
  layout: 'admin/index'  // 正しい
  layout: 'admin'        // これでもOK（indexは省略可能）
  layout: 'adminIndex'   // NG（ファイル名と違う）
}
</script>
```

#### 原因2: ファイルが存在しない
```
layouts/admin/index.vue が実際に存在するか確認
```

#### 確認方法
```
VSCode: Ctrl + P
入力: admin/index
→ ファイルが出てこない = 存在しない
```

---

### 問題2: 「pagesファイルが見つからない」

#### 原因: innerRouterでマッピングされている
```js
// router/innerRouter.js
{
  path: '/admin/user-management',
  component: '0302'  // pages/0302.vue
}
```

#### 確認方法
.nuxt/router.js を見る

---

### 問題3: 「コンポーネントがimportされていないのに使える」

#### 原因: layoutでimportされている
```vue
<!-- layouts/admin/index.vue -->
<script>
import SomeComponent from '~/components/SomeComponent.vue'
</script>
```

#### 確認方法
pages側のlayout指定を確認 → そのlayoutファイルを開く → importを確認

---

### 問題4: 「どの画面で表示されているか全く分からない」

#### 最終手段: 実行して確認

##### 方法1: 目立つ印をつける
```vue
<!-- pages/0302.vue -->
<template>
  <div>
    <h1 style="color: red; font-size: 100px;">★★★ 0302 ★★★</h1>
```

保存 → 開発サーバーの画面を全部見る → 赤い★が出たらそれが0302

##### 方法2: console.log
```vue
<script>
export default {
  mounted() {
    console.log('========== 0302.vue LOADED ==========')
    console.log('URL:', this.$route.path)
    console.log('Layout:', this.$nuxt.layout || this.$options.layout)
  }
}
</script>
```

---

## チェックリスト

### 調査開始時

```
□ 調査対象のファイルパスを確認
  例: pages/0302.vue または layouts/admin/index.vue

□ プロジェクトにinnerRouterがあるか確認
  検索: innerRouter
  対象: **/*.js

□ .nuxtフォルダが存在するか確認
  npm run dev を実行していれば存在する
```

---

### pagesファイルを調査する時

```
□ ファイルを開いて中身を確認
  - h1タグ、title、name、コメントで画面名を推測

□ layout指定を確認
  - layout: 'xxx' があるか
  - なければ default.vue

□ innerRouter で検索
  - component: '0302' で該当するか

□ .nuxt/router.js で検索
  - import文とroutesで対応を確認
```

---

### layoutファイルを調査する時

```
□ layoutファイル名を確認
  layouts/admin/index.vue
  → 指定名: 'admin/index' または 'admin'

□ このlayoutを使うpagesを検索
  検索: layout:\s*['"]admin
  対象: pages/**/*.vue

□ middlewareを確認
  検索: admin
  対象: middleware/*.js

□ innerRouterを確認
  検索: admin
  対象: router/innerRouter.js

□ このlayoutでimportされているコンポーネントをリスト化
  → これらは全ページで使える
```

---

### 実務: モーダルファイルがどの画面で使えるか調査する時

**状況:**
```
調査目的: ConfirmModal.vue がどの画面で表示されるか調べる
```

**手順:**

**STEP 1: モーダルファイルをimportしている箇所を全検索**
```
Ctrl + Shift + F
検索: ConfirmModal
対象: **/*.vue
```

**STEP 2: 検索結果を確認**

結果パターンA: pagesファイルでimportされている
```
pages/admin/users.vue:
  import ConfirmModal from '~/components/ConfirmModal.vue'
  
→ pages/admin/users.vue でモーダルが使える
```

結果パターンB: layoutファイルでimportされている
```
layouts/admin/index.vue:
  import ConfirmModal from '~/components/ConfirmModal.vue'
  
→ このlayoutを使う全pagesで使える（次のSTEPへ）
```

**STEP 3: layoutを使っているpagesを全検索**
```
Ctrl + Shift + F
検索: layout:\s*['"]admin
対象: pages/**/*.vue
正規表現: ON
```

**STEP 4: 結果をまとめる**
```
見つかったファイル:
- pages/0302.vue
- pages/0402.vue
- pages/0502.vue

→ これら全ての画面で ConfirmModal が表示可能
```

**STEP 5: 表示条件を確認**

各pagesファイルを開いて、モーダルを呼び出している箇所を確認:
```vue
<!-- pages/0302.vue -->
<template>
  <div>
    <ConfirmModal v-if="showModal" />  ← v-if で条件付き表示
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false  ← この値がtrueの時に表示
    }
  },
  methods: {
    openModal() {
      this.showModal = true  ← ここで表示される
    }
  }
}
</script>
```

または、layoutで呼び出しを確認:
```vue
<!-- layouts/admin/index.vue -->
<template>
  <div>
    <nuxt />
    <ConfirmModal v-if="$store.state.showConfirmModal" />  ← Vuexで制御
  </div>
</template>
```

**まとめの例:**
```
ConfirmModal.vue の表示条件:

【layouts/admin/index.vue でimport】
→ このlayoutを使う全画面で利用可能

【利用可能な画面】
1. pages/0302.vue (ユーザー管理画面)
   - 条件: ユーザー削除ボタンクリック時
   - コード: deleteUser() メソッド内

2. pages/0402.vue (商品管理画面)
   - 条件: 商品削除ボタンクリック時
   - コード: deleteProduct() メソッド内

3. pages/0502.vue (注文管理画面)
   - 条件: 注文キャンセルボタンクリック時
   - コード: cancelOrder() メソッド内
```

**結論:**
**layoutでimportされている = そのlayoutを使う全pagesで使える**

だから、layoutファイルがヒットしたら、そのlayoutを使っているpagesを全部探せばOK。

---

### 最終確認

```
□ 実行して動作確認
  npm run dev
  console.log で出力確認

□ Vue DevToolsで確認
  ブラウザでコンポーネント階層を確認

□ 分からなければ先輩に聞く
  「0302.vueは何の画面ですか？」
  「innerRouterの仕様書はありますか？」
```

---

## 重要な心得

### 1. importで追跡しようとしない
Nuxtでは pages と layouts は**importされない**。
ファイルパス、URL、layout指定で追跡する。

### 2. .nuxt/router.js は真実
innerRouterやnuxt.config.jsの設定が全部適用された**最終結果**。
迷ったらこれを見る。

### 3. 力技も有効
- console.log
- 目立つ印をつける
- 実際に画面を開いて確認

### 4. 完璧を求めない
ドキュメントがない、コメントがない、省略形で書かれている。
それが現実。諦めずに調べる。

### 5. 先輩に聞くのも戦略
調査に30分以上かかるなら、先輩に聞いた方が早い。

---

## クイックリファレンス

### よく使うVSCode検索

```
1. layoutを使っているページを探す
   検索: layout:\s*['"]admin
   正規表現: ON
   対象: pages/**/*.vue

2. ファイル名で検索
   検索: 0302
   対象: **/*.js, **/*.vue

3. innerRouterを探す
   検索: innerRouter
   対象: **/*.js

4. layout設定を探す
   検索: layout
   対象: middleware/*.js, nuxt.config.js
```

---

### よく使うconsole.log

```vue
<script>
export default {
  mounted() {
    console.log('========================================')
    console.log('ファイル: pages/0302.vue')
    console.log('URL:', this.$route.path)
    console.log('Layout:', this.$nuxt.layout || this.$options.layout || 'default')
    console.log('========================================')
  }
}
</script>
```

---

### 先輩への質問テンプレート

```
1. 「0302.vueは何の画面ですか？」

2. 「ファイル名と画面名の対応表はありますか？」

3. 「innerRouterの仕様書やドキュメントはありますか？」

4. 「0から始まるファイルは全部どのlayoutを使いますか？」

5. 「.nuxt/router.jsを見れば、URLとファイルの対応が分かりますか？」
```

---

## 最後に

**このガイドを印刷またはブックマークして、業務中に常に参照できるようにする。**

**迷ったら、このガイドの「実務での調査フロー」セクションに戻る。**

**諦めずに調べれば、必ず答えは見つかる。頑張れ。**
