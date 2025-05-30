import en from '../app/locales/en.json'
import ru from '../app/locales/ru.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    ru,
  },
}))
