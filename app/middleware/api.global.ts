export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') {
    const tgWebAppStore = useTgWebAppStore()
    console.warn('userInPair:', tgWebAppStore.userInPair)
    console.warn('isCreatePair:', tgWebAppStore.isCreatePair)

    // Если пользователь создает пару, перенаправляем на wait
    if (tgWebAppStore.isCreatePair) {
      return navigateTo('/wait')
    }

    // Если пользователь не в паре, перенаправляем на connect
    if (!tgWebAppStore.userInPair) {
      return navigateTo('/connect')
    }
  }
  // Otherwise, allow navigation
})
