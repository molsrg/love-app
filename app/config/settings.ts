import type { Sections, Theme } from '~/types/settings'

export const SETTINGS_SECTIONS: Sections = {
  profile: {
    title: 'Профиль',
    icon: 'i-heroicons-user-circle',
  },
  pair: {
    title: 'Пара',
    icon: 'i-heroicons-users',
  },
} as const

export const THEMES: Theme[] = [
  { name: 'Розовый', value: 'rose' },
  { name: 'Зелёный', value: 'emerald' },
  { name: 'Голубой', value: 'blue' },
  { name: 'Жёлтый', value: 'amber' },
  { name: 'Индиго', value: 'indigo' },
] as const
