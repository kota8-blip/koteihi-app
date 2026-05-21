# 固定費管理サービス 引き継ぎメモ

## サービス概要

| 項目 | 内容 |
|------|------|
| サービス内容 | 固定費（サブスク・保険・ジム等）だけを管理するシンプルなWebアプリ |
| ターゲット | 「何に毎月いくら払ってるか分からない」人 |
| コアバリュー | 機能を絞ったシンプルさ・広告なし・入力が楽 |
| マネタイズ | 無料：登録5件まで / 有料：無制限＋グラフ＋通知＋CSV |
| 有料価格感 | 月額500〜980円が妥当 |

---

## 技術スタック

今の家計簿アプリ（my-nuxt-elm）と**全く同じスタック**で作る。

| 役割 | 技術 |
|------|------|
| フロントエンド | Nuxt 2（SPA mode） |
| バックエンド | Express + PostgreSQL |
| 認証 | JWT（bcrypt + jsonwebtoken） |
| 状態管理 | Vuex |
| HTTPクライアント | @nuxt/axios |
| デプロイ（予定） | Vercel（フロント）＋ Railway or Render（バックエンド） |

---

## フォルダ構成

- フロントエンド: `c:\プログラミング\koteihi-app`（新規作成）
- バックエンド: `c:\プログラミング\koteihi-api`（既存を改修 or 新規）

---

## MVP（最初に作る最小機能）

1. ユーザー登録・ログイン
2. 固定費を登録（名前・金額・カテゴリ・支払日）
3. 一覧表示
4. 合計金額の表示
5. 編集・削除

グラフ・通知・CSVは有料機能として後回し。

---

## 既存コードから流用できるもの

`c:\プログラミング\my-nuxt-elm` から以下をコピペして使う：

| ファイル | 用途 |
|----------|------|
| `middleware/auth.js` | 未ログイン時に/loginへリダイレクト |
| `layouts/empty.vue` | ヘッダーなしのログイン用レイアウト |
| `pages/login.vue` | ログイン＋ユーザー登録画面 |
| `store/index.js` | 認証部分のみ（logIn / register / SET_JWT / LOAD_FROM_STORAGE） |
| `nuxt.config.js` | axios baseURL等の設定参考に |

### store/index.js の認証部分（コピペ用）

```js
state: {
  jwt: null,
},

mutations: {
  SET_JWT(state, jwt) {
    state.jwt = jwt;
  },
  LOAD_FROM_STORAGE(state) {
    const token = localStorage.getItem('token');
    if (token) state.jwt = token;
  },
},

actions: {
  async logIn({ commit }, payload) {
    const response = await this.$axios.post('/api/login', { ...payload });
    const jwt = response.data.token;
    commit('SET_JWT', jwt);
    if (process.client) { localStorage.setItem('token', jwt); }
    this.$axios.setHeader('Authorization', `Bearer ${jwt}`);
  },
  async register({ commit }, payload) {
    const response = await this.$axios.post('/api/register', { ...payload });
  },
},
```

### layouts/default.vue の mounted（コピペ用）

```js
async mounted() {
  this.$store.commit('LOAD_FROM_STORAGE');
  if (this.$store.state.jwt) {
    this.$axios.setHeader('Authorization', `Bearer ${this.$store.state.jwt}`);
    await this.$store.dispatch('loadFixedCosts'); // ← action名は変更
  }
},
```

---

## バックエンド（my-express-api）について

- 現在: 家計簿用のtransactionsテーブル＋APIが実装済み
- 方針: 固定費用の新テーブル（fixed_costs）を追加し、新しいAPIルートを作る
- 認証middleware（authenticateToken）はそのまま使い回せる

### 固定費テーブル（案）

```sql
CREATE TABLE fixed_costs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,       -- 例: Netflix
  amount INTEGER NOT NULL,           -- 例: 1490
  category VARCHAR(50),              -- 例: 動画配信
  billing_day INTEGER,               -- 例: 毎月15日
  memo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 新プロジェクト作成手順

```bash
cd c:\プログラミング
npx create-nuxt-app koteihi-app
```

設定の選択肢（推奨）:
- Package manager: npm
- UI framework: None（自分でCSS書く）
- Nuxt.js modules: Axios
- Linting tools: なしでOK
- Testing framework: None
- Rendering mode: Single Page App
- Deployment target: Static

その後：
1. GitHubに新リポジトリ `koteihi-app` を作成
2. `git init` → `git remote add origin [URL]`
3. 認証ファイルをコピペ

---

## 開発方針

- スマホ対応（モバイルファースト）でCSSを書く
- シンプルUI優先（競合の「多機能すぎ」「UI重い」を反面教師に）
- 最初は日本語UIのみ
- PWA化は後でやる（ホーム画面に追加できるようになる）
- 集客: Twitter（開発過程を発信）＋ Zennに開発記事を書く

---

## 既存スタックの知識確認

以下は習得済みなので新プロジェクトでもそのまま使える：
- Vuex（state / mutations / actions / getters）
- JWT認証（ログイン・登録・middleware・localStorage永続化）
- @nuxt/axios（APIリクエスト・Authorizationヘッダー設定）
- Express + PostgreSQL（CRUD API・authenticateToken middleware）
