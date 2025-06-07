import type { Sections, Theme } from '~/types/settings'

export const SETTINGS_SECTIONS: Sections = {
  profile: {
    title: 'settings.sections.profile',
    icon: 'i-heroicons-user-circle',
  },
  pair: {
    title: 'settings.sections.pair',
    icon: 'i-heroicons-users',
  },
} as const

export const THEMES: Theme[] = [
  { name: 'settings.profile.themes.rose', value: 'rose' },
  { name: 'settings.profile.themes.emerald', value: 'emerald' },
  { name: 'settings.profile.themes.blue', value: 'blue' },
  { name: 'settings.profile.themes.amber', value: 'amber' },
  { name: 'settings.profile.themes.indigo', value: 'indigo' },
] as const
