export default defineNuxtRouteMiddleware(async (to, from) => {
  console.warn('Middleware From:', from.path)
  console.warn('Middleware To:', to.path)

  const tgWebAppStore = useTgWebAppStore()
  console.warn('Middleware isCreatePair:', tgWebAppStore.isCreatePair)
  console.warn('Middleware userInPair:', tgWebAppStore.userInPair)

  if (!tgWebAppStore.userInPair && to.path !== '/connect') {
    return navigateTo('/connect')
  }

  if (tgWebAppStore.isCreatePair && to.path === '/') {
    return navigateTo('/wait')
  }
})
