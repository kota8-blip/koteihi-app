
# Vue.js 属性（props・ディレクティブ・イベント）と子要素（slot・template・v-for・条件分岐など）の違いまとめ

## 属性（props・ディレクティブ・イベント）
- タグの中で指定する値や機能
- 親から子コンポーネントへデータや動作を渡す
- 代表例：
  - **props**（値の受け渡し）
    ```vue
    <user-card :name="'山田太郎'" :age="25" />
    ```
  - **イベント**（@click, @input など）
    ```vue
    <button @click="doSomething">押す</button>
    ```
  - **ディレクティブ**（v-model, v-bind, v-if, v-show など）
    ```vue
    <input v-model="userName" />
    <img v-bind:src="imgUrl" />
    <div v-if="isShow">表示</div>
    ```
  - **propsの型・デフォルト・必須指定**
    ```js
    props: {
      name: { type: String, required: true },
      age: { type: Number, default: 20 }
    }
    ```

## 子要素（slot・template・v-for・条件分岐など）
- タグの間に書く内容や構造
- 親から子コンポーネントへ、任意のHTMLやコンポーネント・構造を埋め込む
- 代表例：
  - **slot（デフォルトslot）**
    ```vue
    <message>
      <span>これはslotの内容</span>
    </message>
    ```
  - **名前付きslot**
    ```vue
    <user-card>
      <template v-slot:header>
        <h2>ヘッダー</h2>
      </template>
      <template v-slot:footer>
        <p>フッター</p>
      </template>
    </user-card>
    ```
  - **スコープ付きslot**
    ```vue
    <list-renderer :items="items">
      <template v-slot="slotProps">
        <div>{{ slotProps.item.name }}</div>
      </template>
    </list-renderer>
    ```
  - **templateタグ（条件分岐・ループ）**
    ```vue
    <template v-if="isShow">
      <p>表示される内容</p>
    </template>
    <template v-for="item in items">
      <div>{{ item }}</div>
    </template>
    ```
  - **子コンポーネント**
    ```vue
    <message>
      <UserIcon />
    </message>
    ```
  - **テキストやHTMLタグ**
    ```vue
    <message>
      <p>説明文</p>
    </message>
    ```

## まとめ
- 属性（props・ディレクティブ・イベント）は「値・動作・制御の受け渡し」
- 子要素（slot・template・v-for・条件分岐など）は「表示内容・構造の差し込み」
- 両方使うことで柔軟なUI設計・ロジックが可能
