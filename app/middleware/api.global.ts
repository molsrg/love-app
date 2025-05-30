export default defineNuxtRouteMiddleware((to) => {
  // Check if it's the first launch only when navigating to the root path
  if (to.path === '/') {
    // Ensure localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const isFirstLaunch = localStorage.getItem('isFirstLaunch')

      if (!isFirstLaunch || isFirstLaunch === 'true') {
        // Mark as not the first launch
        localStorage.setItem('isFirstLaunch', 'false')
        // Redirect to connect page
        return navigateTo('/connect')
      }
    }
  }
  // Otherwise, allow navigation
})
