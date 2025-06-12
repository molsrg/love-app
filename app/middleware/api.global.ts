export default defineNuxtRouteMiddleware(async (to) => {
  const tgWebAppStore = useTgWebAppStore()

  // Wait for tgWebAppStore to be initialized
  if (!tgWebAppStore.isInitialized) {
    console.warn('Middleware: tgWebAppStore not initialized, waiting...')
    await tgWebAppStore.init()
    console.warn('Middleware: tgWebAppStore initialized. New userInPair:', tgWebAppStore.userInPair, 'New isCreatePair:', tgWebAppStore.isCreatePair)
  }

  // Priority 1: If user is paired, navigate to home if trying to access wait or connect
  if (tgWebAppStore.userInPair && (to.path === '/wait' || to.path === '/connect')) {
    console.warn('Middleware: User is paired and on wait/connect, navigating to /')
    return navigateTo('/')
  }

  // Priority 2: If isCreatePair is true (meaning waiting for partner), navigate to /wait
  if (tgWebAppStore.isCreatePair && to.path !== '/wait') {
    console.warn('Middleware: isCreatePair is true, navigating to /wait')
    return navigateTo('/wait')
  }

  // Priority 3: If user is not paired and not creating a pair, navigate to /connect
  if (!tgWebAppStore.userInPair && !tgWebAppStore.isCreatePair && to.path !== '/connect') {
    console.warn('Middleware: User not paired and not creating pair, navigating to /connect')
    return navigateTo('/connect')
  }
})
