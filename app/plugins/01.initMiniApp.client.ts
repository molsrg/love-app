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
    : (locationManager.isAccessGranted?.value ?? false)), async (val) => {
    accessGranted.value = val
    try {
      await useApi().post('/geo/approve', { approveGeo: val })
    }
    catch (e) {
      console.warn('Ошибка при отправке approveGeo:', e)
    }
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

  // Установка CSS-переменных для safe-area-inset и content-safe-area-inset
  function setSafeAreaInsets() {
    const root = document.documentElement
    const tg = window.Telegram?.WebApp

    if (tg?.safeAreaInset) {
      root.style.setProperty('--tg-safe-area-inset-top', `${tg.safeAreaInset.top || 0}px`)
      root.style.setProperty('--tg-safe-area-inset-bottom', `${tg.safeAreaInset.bottom || 0}px`)
      root.style.setProperty('--tg-safe-area-inset-left', `${tg.safeAreaInset.left || 0}px`)
      root.style.setProperty('--tg-safe-area-inset-right', `${tg.safeAreaInset.right || 0}px`)
    } else {
      root.style.setProperty('--tg-safe-area-inset-top', '0px')
      root.style.setProperty('--tg-safe-area-inset-bottom', '0px')
      root.style.setProperty('--tg-safe-area-inset-left', '0px')
      root.style.setProperty('--tg-safe-area-inset-right', '0px')
    }
    if (tg?.contentSafeAreaInset) {
      root.style.setProperty('--tg-content-safe-area-inset-top', `${tg.contentSafeAreaInset.top || 0}px`)
      root.style.setProperty('--tg-content-safe-area-inset-bottom', `${tg.contentSafeAreaInset.bottom || 0}px`)
      root.style.setProperty('--tg-content-safe-area-inset-left', `${tg.contentSafeAreaInset.left || 0}px`)
      root.style.setProperty('--tg-content-safe-area-inset-right', `${tg.contentSafeAreaInset.right || 0}px`)
    } else {
      root.style.setProperty('--tg-content-safe-area-inset-top', '0px')
      root.style.setProperty('--tg-content-safe-area-inset-bottom', '0px')
      root.style.setProperty('--tg-content-safe-area-inset-left', '0px')
      root.style.setProperty('--tg-content-safe-area-inset-right', '0px')
    }
  }
  setSafeAreaInsets()

  // Подписка на события изменения safe area
  if (window.Telegram?.WebApp?.onEvent) {
    window.Telegram.WebApp.onEvent('safeAreaChanged', setSafeAreaInsets)
    window.Telegram.WebApp.onEvent('contentSafeAreaChanged', setSafeAreaInsets)
  }

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
