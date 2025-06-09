export default defineNuxtRouteMiddleware(async (to) => {
  const tgWebAppStore = useTgWebAppStore()
  console.warn('userInPair:', tgWebAppStore.userInPair)
  console.warn('isCreatePair:', tgWebAppStore.isCreatePair)

  if (tgWebAppStore.isCreatePair) {
    return navigateTo('/wait')
  }

  if (!tgWebAppStore.userInPair) {
    return navigateTo('/connect')
  }
})
