export function useHapticFeedback() {
  function telegramSelectionChanged() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    }
  }

  function telegramNotificationOccurred(type: 'error' | 'success' | 'warning' = 'success') {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(type)
    }
  }

  function telegramImpactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style)
    }
  }

  return {
    telegramSelectionChanged,
    telegramNotificationOccurred,
    telegramImpactOccurred,
  }
}
