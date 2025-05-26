export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
      ],
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: '',
      botToken: '',
      chatId: '',
      devServerHost: '',
      devServerPort: 5000,
    },
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'orange', 'indigo', 'black', 'cyan', 'stone', 'gray', 'lime', 'rose', 'info', 'success', 'warning', 'error', 'amber', 'blue', 'emerald'],
    },
  },

  devServer: {
    // eslint-disable-next-line node/prefer-global/process
    host: process.env.NUXT_DEV_SERVER_HOST || 'localhost',
    // eslint-disable-next-line node/prefer-global/process
    port: Number.parseInt(process.env.NUXT_DEV_SERVER_PORT || '3000', 10),
  },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/color-mode'],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_language',
      redirectOn: 'root',
    },
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
  },

  compatibilityDate: '2024-11-27',
})
