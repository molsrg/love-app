export default defineNuxtRouteMiddleware(async (to) => {
  const tgWebAppStore = useTgWebAppStore()

  // Wait for tgWebAppStore to be initialized
  if (!tgWebAppStore.getIsInitialized) {
    console.warn('Middleware: tgWebAppStore not initialized, waiting...')
    await tgWebAppStore.init()
    console.warn('Middleware: tgWebAppStore initialized. New userInPair:', tgWebAppStore.getUserInPair, 'New isCreatePair:', tgWebAppStore.getIsCreatePair)
  }

  // Priority 1: If user is paired, navigate to home if trying to access wait or connect
  if (tgWebAppStore.getUserInPair && (to.path === '/wait' || to.path === '/connect')) {
    console.warn('Middleware: User is paired and on wait/connect, navigating to /')
    return navigateTo('/')
  }

  // Priority 2: If isCreatePair is true (meaning waiting for partner), navigate to /wait
  if (tgWebAppStore.getIsCreatePair && to.path !== '/wait') {
    console.warn('Middleware: isCreatePair is true, navigating to /wait')
    return navigateTo('/wait')
  }

  // Priority 3: If user is not paired and not creating a pair, navigate to /connect
  if (!tgWebAppStore.getUserInPair && !tgWebAppStore.getIsCreatePair && to.path !== '/connect') {
    console.warn('Middleware: User not paired and not creating pair, navigating to /connect')
    return navigateTo('/connect')
  }
})
