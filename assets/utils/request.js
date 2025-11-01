import axios from 'axios';
import config from '~/config';
import { Toast } from 'mint-ui';

axios.defaults.baseURL = config.BASE_URL;
axios.defaults.timeout = config.TIMEOUT;
axios.defaults.headers = config.HEADERS;

// 请求拦截器（ログ時に未定義ガード）
axios.interceptors.request.use(req => {
  if (!config.IS_RELEASE) {
    try {
      console.log(
        `${new Date().toLocaleString()}【 M=${req && req.url} 】P=`,
        (req && (req.params || req.data)) || null
      );
    } catch (_) {}
  }
  return req;
}, error => Promise.reject(error));

export default async (options = { method: 'GET' }) => {
  const method = (options.method || 'GET').toUpperCase();
  const isData = ['POST', 'PUT', 'PATCH'].includes(method);

  try {
    const res = await axios({
      method,
      url: options.url,
      data: isData ? (options.data || null) : null,
      params: !isData ? (options.data || null) : null,
      validateStatus: s => s >= 200 && s < 400, // 3xxでも落とさない
    });

    const payload = res ? res.data : undefined;

    if (!config.IS_RELEASE) {
      console.log(`${new Date().toLocaleString()}【接口响应：】`, payload);
    }

    // Toastは code フィールドが存在する時だけ
    if (
      typeof window !== 'undefined' &&
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      Object.prototype.hasOwnProperty.call(payload, 'code') &&
      payload.code !== 0
    ) {
      Toast(payload.msg || '请求错误');
    }

    // 返却を正規化： {data: ...} を優先、なければそのまま
    const normalized =
      payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload
        ? payload.data
        : payload;

    return normalized;
  } catch (err) {
    // 失敗時も .map() で落ちない形を返す
    if (typeof window !== 'undefined') {
      try { Toast('请求错误'); } catch (_) {}
    }
    if (options.url && /shopping\/(restaurants|pois|food_entries)/.test(options.url)) {
      return []; // 配列を期待している系は空配列で返す
    }
    return {}; // それ以外は空オブジェクト
  }
};
