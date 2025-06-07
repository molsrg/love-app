import { useCloudStorage } from 'vue-tg/latest'

const AVAILABLE_LANGUAGES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

export function useLanguage() {
  const { locale } = useI18n()
  const currentLocale = ref(locale.value)
  const { telegramSelectionChanged } = useHapticFeedback()
  const setLanguage = (newLocale: string) => {
    telegramSelectionChanged()
    currentLocale.value = newLocale
    locale.value = newLocale

    useCloudStorage().setItem('locale', newLocale)
  }

  return {
    currentLocale,
    setLanguage,
    languages: AVAILABLE_LANGUAGES,
  }
}
