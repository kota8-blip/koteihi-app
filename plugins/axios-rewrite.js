// plugins/axios-rewrite.js
export default function ({ $axios }) {
  if (!$axios) return;

  // ---- 送信前の書き換え（いま入っていた内容を活かす） ----
  if ($axios.onRequest) {
    $axios.onRequest((config) => {
      try {
        // baseURL が http://localhost:3000/api のときは 3001 に付替え
        if (config.baseURL && /http:\/\/localhost:3000\/api\/?$/i.test(config.baseURL)) {
          config.baseURL = 'http://localhost:3001';
        }
        // 絶対URLのとき（外部直叩きや localhost:3000/api 直書き）
        if (config.url && /^https?:\/\//i.test(config.url)) {
          const u = new URL(config.url);
          if (u.hostname === 'elm-api.caibowen.net') {
            u.protocol = 'http:'; u.host = 'localhost:3001';
            config.url = u.toString();
          }
          if (u.hostname === 'localhost' && u.port === '3000' && u.pathname.startsWith('/api')) {
            u.protocol = 'http:'; u.host = 'localhost:3001';
            u.pathname = u.pathname.replace(/^\/api/, '');
            config.url = u.toString();
          }
        } else if (typeof config.url === 'string' && config.url.startsWith('/api')) {
          config.baseURL = 'http://localhost:3001';
          config.url = config.url.replace(/^\/api/, '');
        }
      } catch (_) {}
      return config;
    });
  }

  // ---- 受信後の形を強制（.map() で落ちないようにする）----
  $axios.onResponse((resp) => {
    try {
    const url = (resp.config && resp.config.url) || '';
    let data = resp.data;

    // 1) まず URL と 受け取った型を出す（特定用）
    //    これがコンソールに出る → mapで落ちてるURLが分かる
    // eslint-disable-next-line no-console
    console.log('[AXIOS]', url, 'type=', Array.isArray(data) ? 'array' : typeof data);

    // 2) “配列を期待する”可能性が高いエンドポイントを全部ここに列挙
    const forceArrayEndpoints = [
      '/shopping/restaurants',
      '/shopping/pois',
      '/shopping/v2/restaurants',
      '/shopping/food_entries',
      '/search/restaurant',
      '/msite/restaurant/list'
    ];

    if (forceArrayEndpoints.some(p => url.includes(p))) {
      if (Array.isArray(data)) {
        // OK
      } else if (data && Array.isArray(data.data)) {
        data = data.data;
      } else {
        data = []; // ← ここで必ず配列にする
      }
      resp.data = data;
      return resp;
    }

    // 3) オブジェクト期待
    const forceObjectEndpoints = ['/common/getHomeData'];
    if (forceObjectEndpoints.some(p => url.includes(p))) {
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // OK
      } else if (data && data.data && typeof data.data === 'object') {
        data = data.data;
      } else {
        data = {};
      }
      resp.data = data;
      return resp;
    }

    return resp;
  } catch (_) {
    return resp;
  }
});
}