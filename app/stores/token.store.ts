export const useTokenStore = defineStore('tokenStore', () => {
  const token: Ref<string> = ref('')
  const loggedIn: Ref<boolean> = ref(false)

  const getToken: ComputedRef<string> = computed(() => token.value)
  const getStatus: ComputedRef<boolean> = computed(() => loggedIn.value)

  function setToken(newToken: string): void {
    token.value = newToken
    loggedIn.value = true
  }

  async function updateToken(): Promise<void> {
    await useTgWebAppStore().setInitData()
  }

  return {
    getToken,
    getStatus,
    setToken,
    updateToken,
  }
})

export type TokenStore = ReturnType<typeof useTokenStore>
