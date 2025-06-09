import { useCloudStorage } from 'vue-tg/latest'

export default defineNuxtPlugin(async (nuxtApp) => {
  const savedLocale = await useCloudStorage().getItem('locale')

  if (savedLocale) {
    nuxtApp.vueApp.config.globalProperties.$i18n.locale = savedLocale
  }
})
