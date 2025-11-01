/* minimal flexible.js (rem基準設定) */
(function () {
  var d = document;
  function refresh() {
    var w = d.documentElement.clientWidth || 375;
    // 375px幅を基準に 16px を根拠にしたREMを計算（適当に調整OK）
    d.documentElement.style.fontSize = (w / 375 * 16) + 'px';
  }
  window.addEventListener('resize', refresh);
  refresh();
})();
