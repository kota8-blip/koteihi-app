# Vueでthisに直接プロパティを追加する使い方まとめ

## 概要
- Vueのインスタンス（this）は、dataで定義していないプロパティも動的に追加できる
- 画面表示やリアクティブ管理が不要な「一時的な値」によく使う

## 主な用途
- タイマーID（setInterval, setTimeoutの返り値）
- 一時的なフラグや内部処理用の値
- APIリクエストの一時的な結果やエラー情報（画面に出さない場合）
- イベントハンドラ内だけで使う一時的な値

## 例
```js
created() {
  this.timer = setInterval(() => {
    this.時間 = new Date().toLocaleTimeString();
  }, 1000);
}
beforeDestroy() {
  clearInterval(this.timer);
}
```

## ポイント
- 画面に表示する値は必ずdataで定義する
- 内部処理用や一時的な値はthisに直接追加してOK
- 迷ったら「表示するものはdata、処理用はthis」

---
このファイルを読み返せば、現場で混乱しにくくなります！