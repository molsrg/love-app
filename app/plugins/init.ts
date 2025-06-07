import { navigateTo } from '#app'
import { useWebAppTheme } from 'vue-tg'

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

  const setInitData = async () => {
    // const theme = await useCloudStorage().getItem('theme')
    // appConfig.ui.colors.primary = theme.value
  }

  const init = async () => {
    setWebAppData()
    if (['ios', 'android'].includes(webAppData.value.platform)) {
      window.Telegram.WebApp.requestFullscreen()
      isMobile.value = true
    }

    window.Telegram.WebApp.disableVerticalSwipes()
    window.Telegram.WebApp.SettingsButton.show()
    window.Telegram.WebApp.SettingsButton.onClick(() =>
      navigateTo('/settings'))

    if (webAppData.value.version > '6.0') {
      window.Telegram.WebApp.lockOrientation('portrait')
      useWebAppTheme().setBackgroundColor('#151719')
      useWebAppTheme().setHeaderColor('#151719')
      await setInitData()
    }
  }

  return {
    provide: {
      initApp: init,
      isMobile,
    },
  }
})
