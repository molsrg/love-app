import { navigateTo } from '#app'

declare global {
  interface Window {
    Telegram: {
      WebApp: any
    }
  }
}

export default defineNuxtPlugin(async () => {
  const webAppData = ref({
    platform: '',
    version: '',
  })
  const isMobile = ref(false)

  const setWebAppData = () => {
    webAppData.value = {
      platform: window.Telegram.WebApp.platform,
      version: window.Telegram.WebApp.version,
    }
  }

  setWebAppData()

  if (['ios', 'android'].includes(webAppData.value.platform)) {
    window.Telegram.WebApp.requestFullscreen()
    isMobile.value = true
  }

  window.Telegram.WebApp.disableVerticalSwipes()
  // window.Telegram.WebApp.SettingsButton.show()
  // window.Telegram.WebApp.SettingsButton.onClick(() =>
  //   navigateTo('/settings'))

  if (webAppData.value.version > '6.0') {
    window.Telegram.WebApp.lockOrientation('portrait')
    // useWebAppTheme().setBackgroundColor('#151719')
    // useWebAppTheme().setHeaderColor('#151719')
  }

  return {
    provide: {
      isMobile,
      webAppData,
    },
  }
})
