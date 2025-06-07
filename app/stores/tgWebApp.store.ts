import { CalendarDate } from '@internationalized/date'
import { useWebAppTheme } from 'vue-tg'
import { useCloudStorage, useMiniApp } from 'vue-tg/latest'

export const useTgWebAppStore = defineStore('tgWebAppStore', {
  state: () => ({
    webAppData: null,
    initDataUnsafe: null,
    initData: null,

    registrationDate: new CalendarDate(2024, 11, 1),
    isMobile: false,
  }),

  actions: {
    async init() {
      this.setWebAppData()
      if (['ios', 'android'].includes(this.webAppData.platform)) {
        Telegram.WebApp.requestFullscreen()
        this.isMobile = true
      }
      Telegram.WebApp.disableVerticalSwipes()
      Telegram.WebApp.SettingsButton.show()
      Telegram.WebApp.SettingsButton.onClick(() =>
        navigateTo('/settings'))

      if (this.webAppData.version > '6.0') {
        Telegram.WebApp.lockOrientation('portrait')
        useWebAppTheme().setBackgroundColor('#121212')
        useWebAppTheme().setHeaderColor('#151719')
        await this.setInitData()
      }
    },

    setWebAppData() {
      this.webAppData = useMiniApp()
    },

    async setInitData() {
      const appConfig = useAppConfig()
      appConfig.ui.colors.primary = await useCloudStorage().getItem('theme') || 'rose'

      const initData = useMiniApp().initData
      const initDataUnsafe = useMiniApp().initDataUnsafe

      if (initData !== 'user') {
        await useCloudStorage().setItem('initData', initData)
        await useCloudStorage().setItem('initDataUnsafe', JSON.stringify(initDataUnsafe))
      }

      this.initDataUnsafe = initDataUnsafe === null ? JSON.parse(await useCloudStorage().getItem('initDataUnsafe')) : initDataUnsafe
      this.initData = initData === 'user' ? await useCloudStorage().getItem('initData') : initData

      // const { $api } = useNuxtApp()
      // const { accessToken, isRegistered } = await $api.post(endpoints.auth.session, {
      //   queryString: this.initData,
      // })
      //
      // useTokenStore().setToken(accessToken)
    },
  },
})
