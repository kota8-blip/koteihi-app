const express = require('express')
const consola = require('consola')
const proxy = require('express-http-proxy')
const { Nuxt, Builder } = require('nuxt')

const PROXY_URL = 'http://localhost:3001'   // ← モック

const app = express()
const port = process.env.PORT || 3000
app.set('port', port)

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// /api を受けて 3001 へ中継（最小限のリライトルールを追加）
app.use('/api', (req, _res, next) => {
  let p = req.originalUrl.replace(/^\/api(\/|$)/, '/');

  // ★ 特定のエンドポイントだけアンダースコア形式へ変換
  if (p === '/common/getHomeData') p = '/common_getHomeData';
  if (p === '/shopping/restaurants') p = '/shopping_restaurants';

  console.log('[API→MOCK]', req.method, `http://localhost:3001${p}`);
  req._proxiedPath = p;
  next();
}, proxy('http://localhost:3001', {
  proxyReqPathResolver: req => req._proxiedPath
}));

async function start() {
  const nuxt = new Nuxt(config)
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use(nuxt.render)
  app.listen(port)
  consola.ready({ message: `Server listening on http://localhost:${port}`, badge: true })
}
start()
