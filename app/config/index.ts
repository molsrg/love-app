import type { RelationshipGoal } from '~/types/index'

export const RELATIONSHIP_GOALS: RelationshipGoal[] = [
  { days: 30, label: 'index.goals.month' },
  { days: 100, label: 'index.goals.hundredDays' },
  { days: 180, label: 'index.goals.halfYear' },
  { days: 365, label: 'index.goals.year' },
  { days: 730, label: 'index.goals.twoYears' },
  { days: 1095, label: 'index.goals.threeYears' },
  { days: 1825, label: 'index.goals.fiveYears' },
  { days: 3650, label: 'index.goals.tenYears' },
  { days: 9125, label: 'index.goals.twentyFiveYears' },
  { days: 18250, label: 'index.goals.fiftyYears' },
] as const

export const COUNTDOWN_CONFIG = {
  title: 'index.countdown.title',
  units: [
    'index.countdown.units.days',
    'index.countdown.units.hours',
    'index.countdown.units.minutes',
    'index.countdown.units.seconds',
  ],
} as const

interface StatConfig {
  label: string
  value: string | number | null
  textValue?: string
  disabled?: boolean
  route?: string
  resolvedLabel?: string
  classes: {
    value: string
    label: string
    container?: string
  }
}

export const STATS_CONFIG: Record<string, StatConfig> = {
  distance: {
    label: 'index.stats.between',
    value: null,
    textValue: undefined,
    disabled: true,
    classes: {
      value: 'text-primary',
      label: 'text-dimmed line-through',
      container: 'bg-elevated/50',
    },
  },
  days: {
    label: 'index.stats.days',
    value: 0,
    textValue: undefined,
    disabled: false,
    classes: {
      value: 'text-primary',
      label: 'text-highlighted',
      container: 'bg-elevated',
    },
  },
  wishlist: {
    label: 'index.stats.wishlist',
    value: 0,
    textValue: undefined,
    disabled: false,
    route: '/wishlist',
    classes: {
      value: 'text-primary',
      label: 'text-highlighted',
      container: 'bg-elevated',
    },
  },
}
