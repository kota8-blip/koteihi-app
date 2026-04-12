module.exports = {
  mode: 'spa',
  head: {
    title: 'Household Budget',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '毎日の習慣を記録して継続しよう' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
    ],
    link: [
      { rel: 'SHORTCUT ICON', type: 'image/x-icon', href: '/favicon.ico' }
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

  axios: { baseURL: 'http://localhost:3001' },

  loading: { color: '#3B8070' },

  cache: true,

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
    }
  },

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
  plugins: [
    { src: '~/plugins/v-calendar.js', mode: 'client' }
  ]
