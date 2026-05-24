module.exports = {
  mode: 'spa',
  head: {
    title: 'koteihi | 固定費管理アプリ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: '毎月いくら固定で出ていくか、即答できますか？kotehiは、サブスクや家賃など毎月かかる固定費をシンプルに管理できるアプリです。' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'koteihi' },
      { name: 'theme-color', content: '#007bff' },
      // OGP
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'koteihi' },
      { hid: 'og:title', property: 'og:title', content: 'koteihi | 固定費管理アプリ' },
      { hid: 'og:description', property: 'og:description', content: '毎月いくら固定で出ていくか、即答できますか？kotehiは、サブスクや家賃など毎月かかる固定費をシンプルに管理できるアプリです。' },
      { hid: 'og:url', property: 'og:url', content: 'https://koteihi-app.vercel.app' },
      { hid: 'og:image', property: 'og:image', content: 'https://koteihi-app.vercel.app/icon-512.png' },
      // Twitter Card
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'koteihi | 固定費管理アプリ' },
      { hid: 'twitter:description', name: 'twitter:description', content: '毎月いくら固定で出ていくか、即答できますか？kotehiは、サブスクや家賃など毎月かかる固定費をシンプルに管理できるアプリです。' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://koteihi-app.vercel.app/icon-512.png' },
      // Google Search Console
      { name: 'google-site-verification', content: '3w_XTAGip2c3RmZKoqRnGe_c5nhEK6NSXXXVLwoULWk' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  },

  modules: ['@nuxtjs/axios'],

  proxy: {
    '/api/': {
      target: 'http://localhost:3001',
      pathRewrite: { '^/api/': '/' },
      changeOrigin: true
    }
  },

  axios: { baseURL: process.env.API_BASE_URL || 'http://localhost:3001' },

  router: {
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
  },

  loading: { color: '#3B8070' },

  cache: true,

  plugins: [
    { src: '~/plugins/v-calendar.js', mode: 'client' },
    { src: '~/plugins/scroll-restoration.js', mode: 'client' },
  ],

  build: {
    vendor: ['axios', 'mint-ui', 'js-cookie'],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isClient) {
          config.node = {
            child_process: 'empty',
            cluster: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            readline: 'empty',
            inspector: 'empty',
            dns: 'empty',
            dgram: 'empty',
            repl: 'empty',
            module: 'empty',
          }
      }
    }
  },
}
