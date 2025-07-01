import { useCloudStorage } from 'vue-tg/latest'

export default defineNuxtPlugin(async (nuxtApp) => {
  const locale = await useCloudStorage().getItem('locale')
  const savedLocale = locale || useTgWebAppStore().getInitDataUnsafe?.user?.language_code || 'ru'

  if (savedLocale) {
    nuxtApp.vueApp.config.globalProperties.$i18n.locale = savedLocale
  }
})
