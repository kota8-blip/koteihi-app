module.exports = {
  mode: 'spa',
  head: {
    title: 'koteihi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: '毎日の習慣を記録して継続しよう' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: '固定費管理' },
      { name: 'theme-color', content: '#007bff' },
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

  loading: { color: '#3B8070' },

  cache: true,

  plugins: [
    { src: '~/plugins/v-calendar.js', mode: 'client' }
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
