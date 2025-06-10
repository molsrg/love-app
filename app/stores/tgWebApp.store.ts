import { CalendarDate } from '@internationalized/date'
import { useCloudStorage, useMiniApp } from 'vue-tg/latest'
import { useApi } from '~/composables/useApi'

import { usePairStore } from '~/stores/pair.store'
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

    isCreatePair: false,
    userInPair: false,
    isInitialized: false,
  }),

  actions: {
    async init() {
      await this.setInitData()
      this.isInitialized = true
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

      if (this.userInPair) {
        usePairStore().startPairPolling()
        return
      }

      if (this.initDataUnsafe?.start_param) {
        // Validate start_param format: ID_YYYY-MM-DD
        const startParamRegex = /^\d+_\d{4}-\d{2}-\d{2}$/
        if (startParamRegex.test(this.initDataUnsafe.start_param)) {
          // Only set isCreatePair if user is NOT already paired
          if (!this.userInPair) {
            console.warn('start_param detected and valid (not paired), setting isCreatePair.')
            this.isCreatePair = true
          }
          else {
            console.warn('start_param detected but user is already paired. Ignoring isCreatePair.')
            this.isCreatePair = false // Ensure it's false if user is paired
          }
        }
        else {
          console.warn('Invalid start_param format detected:', this.initDataUnsafe.start_param, 'Expected format: ID_YYYY-MM-DD')
          this.isCreatePair = false // Ensure it's false if format is invalid
        }
      }
      else {
        console.warn('No start_param detected.')
        this.isCreatePair = false // Ensure isCreatePair is false if no start_param
      }
    },
  },
})
