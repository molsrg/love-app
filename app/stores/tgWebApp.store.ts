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

      const api = useApi()
      const { accessToken, isRegistration: _isRegistration, isPaired } = await api.post<{ accessToken: string, isRegistration: boolean, isPaired: boolean }>('/auth/init', {
        queryString: this.initData,
      })

      this.userInPair = isPaired

      useTokenStore().setToken(accessToken)

      // Determine initial navigation based on pairing status and start_param
      if (this.userInPair) {
        // If user is already paired, always go to home page
        // console.warn('User is already paired, navigating to /')
        // await navigateTo('/')
      }
      if (this.initDataUnsafe?.start_param) {
        // If not paired, but initiating pair via start_param, go to wait
        // console.warn('start_param detected (not paired), navigating to /wait')
        this.isCreatePair = true
        // await navigateTo('/wait')
      }
      else {
        // If not paired and no start_param, middleware will handle /connect or default to /
        console.warn('User not paired and no start_param. Middleware should handle.')
      }
    },
  },
})
