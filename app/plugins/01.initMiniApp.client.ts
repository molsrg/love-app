import { useLocationManager } from 'vue-tg/latest'

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
  const accessGranted = ref(false)
  const isLocationAvailable = ref(false)
  const locationManager = useLocationManager()

  accessGranted.value = typeof locationManager.isAccessGranted === 'boolean'
    ? locationManager.isAccessGranted
    : (locationManager.isAccessGranted?.value ?? false)
  watch(() => (typeof locationManager.isAccessGranted === 'boolean'
    ? locationManager.isAccessGranted
    : (locationManager.isAccessGranted?.value ?? false)), (val) => {
    accessGranted.value = val
  })

  isLocationAvailable.value = typeof locationManager.isLocationAvailable === 'boolean'
    ? locationManager.isLocationAvailable
    : (locationManager.isLocationAvailable?.value ?? false)
  watch(() => (typeof locationManager.isLocationAvailable === 'boolean'
    ? locationManager.isLocationAvailable
    : (locationManager.isLocationAvailable?.value ?? false)), (val) => {
    isLocationAvailable.value = val
  })

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
      accessGranted,
      isLocationAvailable,
    },
  }
})
