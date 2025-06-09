export default defineNuxtRouteMiddleware(async (to, from) => {
  console.warn('Middleware From:', from.path)
  console.warn('Middleware To:', to.path)

  const tgWebAppStore = useTgWebAppStore()
  console.warn('Middleware isCreatePair:', tgWebAppStore.isCreatePair)
  console.warn('Middleware userInPair:', tgWebAppStore.userInPair)

  // Priority 1: If isCreatePair is true, navigate to /wait
  if (tgWebAppStore.isCreatePair && to.path !== '/wait') {
    return navigateTo('/wait')
  }

  // Priority 2: If user is not paired and not creating a pair, navigate to /connect
  // This applies only if the above condition for isCreatePair is false
  if (!tgWebAppStore.userInPair && !tgWebAppStore.isCreatePair && to.path !== '/connect') {
    return navigateTo('/connect')
  }

  // If user is paired, and not creating a pair, and is not on home, navigate to home (optional, can be handled by default behavior)
  // This would be implicitly handled if no other navigation is triggered, but can be explicit for clarity.
  // if (tgWebAppStore.userInPair && !tgWebAppStore.isCreatePair && to.path !== '/') {
  //   return navigateTo('/')
  // }
})
