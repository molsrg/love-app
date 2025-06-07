export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') {
    const tgWebAppStore = useTgWebAppStore()
    console.log(tgWebAppStore.userInPair)

    // If user is not in pair, redirect to connect page
    if (!tgWebAppStore.userInPair) {
      return navigateTo('/connect')
    }
  }
  // Otherwise, allow navigation
})
