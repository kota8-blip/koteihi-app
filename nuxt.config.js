module.exports = {
  mode: 'spa',
  head: {
    title: '饿了么',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
    ],
    link: [
      { rel: 'SHORTCUT ICON', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/flexible.js', defer: true },
    ],
  },

  modules: ['@nuxtjs/axios'],

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

  plugins: [
  '~/plugins/axios-rewrite.js',
  { src: '~plugins/mint-ui' },
  { src: '~assets/styles/base.scss' },

  // ↓ここを追記（外部画像URLをローカルのダミーに差し替える）
  { src: '~/plugins/block-external-images.client.js' }
],
}

