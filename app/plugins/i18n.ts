import { useCloudStorage } from 'vue-tg/latest'

export default defineNuxtPlugin(async (nuxtApp) => {
  const cloudStorage = useCloudStorage()
  const savedLocale = await cloudStorage.getItem('locale')

  if (savedLocale) {
    nuxtApp.vueApp.config.globalProperties.$i18n.locale = savedLocale
  }
})
