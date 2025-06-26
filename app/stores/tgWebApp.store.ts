import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import { useCloudStorage, useMiniApp } from 'vue-tg/latest'
import { authRepository } from '~/repositories/auth.repository'

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

export const useTgWebAppStore = defineStore('tgWebAppStore', () => {
  const webAppData: Ref<WebAppData | null> = ref(null)
  const initDataUnsafe: Ref<InitDataUnsafe | null> = ref(null)
  const initData: Ref<string | null> = ref(null)
  const isCreatePair: Ref<boolean> = ref(false)
  const userInPair: Ref<boolean> = ref(false)
  const isInitialized: Ref<boolean> = ref(false)
  const startParam = ref('')

  const getInitDataUnsafe: ComputedRef<boolean> = computed(() => initDataUnsafe.value)
  const getIsCreatePair: ComputedRef<boolean> = computed(() => isCreatePair.value)
  const getUserInPair: ComputedRef<boolean> = computed(() => userInPair.value)
  const getIsInitialized: ComputedRef<boolean> = computed(() => isInitialized.value)
  const getStartParam: ComputedRef<string | undefined> = computed(() => startParam.value)

  async function init() {
    await setInitData()
    isInitialized.value = true
  }

  function setWebAppData() {
    webAppData.value = useMiniApp()
  }

  async function setInitData() {
    const miniApp = useMiniApp()
    const cloudStorage = useCloudStorage()
    const uiConfig = useAppConfig().ui

    uiConfig.colors.primary = await cloudStorage.getItem('theme') || 'rose'

    if (miniApp.initData !== 'user') {
      await cloudStorage.setItem('initData', miniApp.initData)
      await cloudStorage.setItem('initDataUnsafe', JSON.stringify(miniApp.initDataUnsafe))
    }

    initDataUnsafe.value = miniApp.initDataUnsafe === null
      ? JSON.parse(await cloudStorage.getItem('initDataUnsafe'))
      : miniApp.initDataUnsafe
    initData.value = miniApp.initData === 'user'
      ? await cloudStorage.getItem('initData')
      : miniApp.initData

    const tokenStore = useTokenStore()
    const { accessToken, isPaired } = await authRepository.login(initData.value)

    userInPair.value = isPaired
    tokenStore.setToken(accessToken)

    if (userInPair.value) {
      usePairStore().startPairPolling()
      return
    }

    const startParam = initDataUnsafe.value?.start_param
    if (startParam) {
      const startParamRegex = /^\d+_\d{4}-\d{2}-\d{2}$/
      if (startParamRegex.test(startParam)) {
        console.warn('start_param detected and valid, setting isCreatePair.')
        setStartParam(startParam)
        isCreatePair.value = true
      }
      else {
        console.warn('Invalid start_param format detected:', startParam)
        isCreatePair.value = false
      }
    }
    else {
      console.warn('No start_param detected.')
      isCreatePair.value = false
    }
  }

  function setUserInPair(value: boolean) {
    userInPair.value = value
  }

  function setIsCreatePair(value: boolean) {
    isCreatePair.value = value
  }

  function setStartParam(value: string) {
    startParam.value = value
  }

  return {
    // Getters
    getIsCreatePair,
    getUserInPair,
    getIsInitialized,
    getStartParam,
    getInitDataUnsafe,
    // Actions
    init,
    setWebAppData,
    setInitData,
    setUserInPair,
    setIsCreatePair,
  }
})

export type TgWebAppStore = ReturnType<typeof useTgWebAppStore>
