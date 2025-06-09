import { CalendarDate } from '@internationalized/date'
import { useCloudStorage, useMiniApp } from 'vue-tg/latest'
import { useApi } from '~/composables/useApi'

import { useTokenStore } from '~/stores/token.store'

interface WebAppData {
  platform: string
  version: string
}

interface InitDataUnsafe {
  start_param?: string
  user?: {
    id: string
    first_name: string
  }
}

export const useTgWebAppStore = defineStore('tgWebAppStore', {
  state: () => ({
    webAppData: null as WebAppData | null,
    initDataUnsafe: null as InitDataUnsafe | null,
    initData: null as string | null,

    registrationDate: new CalendarDate(2024, 11, 1),
    isMobile: false,

    user: null,
    isRegistered: false,

    isCreatePair: false,
    userInPair: false,
  }),

  actions: {
    async init() {
      await this.setInitData()
    },

    setWebAppData() {
      this.webAppData = useMiniApp()
    },

    async setInitData() {
      useAppConfig().ui.colors.primary = await useCloudStorage().getItem('theme') || 'rose'

      const initData = useMiniApp().initData
      const initDataUnsafe = useMiniApp().initDataUnsafe

      if (initData !== 'user') {
        await useCloudStorage().setItem('initData', initData)
        await useCloudStorage().setItem('initDataUnsafe', JSON.stringify(initDataUnsafe))
      }

      this.initDataUnsafe = initDataUnsafe === null ? JSON.parse(await useCloudStorage().getItem('initDataUnsafe')) : initDataUnsafe
      this.initData = initData === 'user' ? await useCloudStorage().getItem('initData') : initData

      // Comment out API request
      // const { accessToken, isPaired } = await api.post<{ accessToken: string, isRegistration: boolean, isPaired: boolean }>('/auth/init', {
      //   queryString: this.initData,
      // })

      // Mock data for testing
      const accessToken = 'mock_token'
      const isPaired = false

      useTokenStore().setToken(accessToken)

      if (this.initDataUnsafe?.start_param) {
        this.isCreatePair = true
        navigateTo('/wait')
      }

      this.userInPair = isPaired
    },
  },
})
