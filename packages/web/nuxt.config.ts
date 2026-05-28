export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '~/assets/styles/reset.scss',
    '~/assets/styles/variables.scss',
    '~/assets/styles/global.scss',
    '~/assets/styles/dark-mode.scss',
    '~/assets/styles/element-override.scss',
    'element-plus/theme-chalk/dark/css-vars.css',
  ],

  modules: [],

  autoImports: {
    imports: ['vue', 'vue-router', '@vueuse/core'],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },

  app: {
    head: {
      title: '淳渔 CMS - 影视内容平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '淳渔 CMS 影视内容管理系统' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  ssr: true,

  typescript: {
    strict: true,
  },
})
