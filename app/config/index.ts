import type { RelationshipGoal } from '~/types/index'

export const RELATIONSHIP_GOALS: RelationshipGoal[] = [
  { days: 30, label: 'index.goals.month' },
  { days: 100, label: 'index.goals.hundredDays' },
  { days: 180, label: 'index.goals.halfYear' },
  { days: 365, label: 'index.goals.year' },
  { days: 1460, label: 'index.goals.threeYears' },
  { days: 5840, label: 'index.goals.fiveYears' },
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
  classes: {
    value: string
    label: string
    container?: string
  }
}

export const STATS_CONFIG: Record<string, StatConfig> = {
  tasks: {
    label: 'км между вами',
    value: null,
    textValue: 'index.stats.soon',
    disabled: true,
    classes: {
      value: 'text-dimmed',
      label: 'text-dimmed line-through',
      container: 'bg-elevated/50',
    },
  },
  days: {
    label: 'index.stats.days',
    value: 0,
    textValue: null,
    disabled: false,
    classes: {
      value: 'text-primary',
      label: 'text-highlighted',
      container: 'bg-elevated',
    },
  },
  challenges: {
    label: 'index.stats.challenges',
    value: null,
    textValue: 'index.stats.soon',
    disabled: true,
    classes: {
      value: 'text-dimmed',
      label: 'text-dimmed line-through',
      container: 'bg-elevated/50',
    },
  },
} as const
