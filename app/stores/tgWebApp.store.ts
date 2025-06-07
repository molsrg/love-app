import { CalendarDate } from '@internationalized/date'
import { useWebAppTheme } from 'vue-tg'
import { useCloudStorage, useMiniApp } from 'vue-tg/latest'
import { useApi } from '~/composables/useApi'

import { useTokenStore } from '~/stores/token.store'

export const useTgWebAppStore = defineStore('tgWebAppStore', {
  state: () => ({
    webAppData: null,
    initDataUnsafe: null,
    initData: null,

    registrationDate: new CalendarDate(2024, 11, 1),
    isMobile: false,

    user: null,
    isRegistered: false,
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

      console.log('initData = ', this.initData)
      console.log('initDataUnsafe = ', this.initDataUnsafe)

      // Отправляем initData на сервер
      // const api = useApi()
      // const { accessToken, isRegistered, user } = await api.post<{
      //   accessToken: string
      //   isRegistered: boolean
      //   user: {
      //     id: number
      //     name: string
      //     avatar: string
      //   }
      // }>('/auth/session', {
      //   queryString: this.initData,
      // })

      console.log(accessToken, isRegistered, user)

      // Сохраняем токен
      useTokenStore().setToken(accessToken)

      // Сохраняем информацию о пользователе
      this.user = user
      this.isRegistered = isRegistered
    },
  },
})
