import en from './en.json'
import ru from './ru.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  messages: {
    en,
    ru,
  },
}))
