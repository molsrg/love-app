<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RelationshipProgress } from '~/components/progress'
import { getDaysTogether, getTimeLeft } from '~/helpers/stats'

const { t } = useI18n()
const pair = usePairStore()
const now = ref<Date>(new Date())
let intervalId: ReturnType<typeof setInterval>

interface RelationshipGoal {
  days: number
  label: string
}

const RELATIONSHIP_GOALS: RelationshipGoal[] = [
  { days: 30, label: t('index.goals.month') },
  { days: 100, label: t('index.goals.hundredDays') },
  { days: 180, label: t('index.goals.halfYear') },
  { days: 365, label: t('index.goals.year') },
  { days: 1460, label: t('index.goals.threeYears') },
  { days: 5840, label: t('index.goals.fiveYears') },
] as const

const COUNTDOWN_CONFIG = {
  title: t('index.countdown.title'),
  units: [
    t('index.countdown.units.days'),
    t('index.countdown.units.hours'),
    t('index.countdown.units.minutes'),
    t('index.countdown.units.seconds'),
  ],
} as const

interface StatConfig {
  label: string
  value: string | number
  disabled?: boolean
  classes: {
    value: string
    label: string
    container?: string
  }
}

const STATS_CONFIG: Record<string, StatConfig> = {
  tasks: {
    label: t('index.stats.tasks'),
    value: t('index.stats.soon'),
    disabled: true,
    classes: {
      value: 'text-dimmed',
      label: 'text-dimmed line-through',
      container: 'bg-elevated/50',
    },
  },
  days: {
    label: t('index.stats.days'),
    value: 0,
    disabled: false,
    classes: {
      value: 'text-primary',
      label: 'text-highlighted',
      container: 'bg-elevated',
    },
  },
  challenges: {
    label: t('index.stats.challenges'),
    value: t('index.stats.soon'),
    disabled: true,
    classes: {
      value: 'text-dimmed',
      label: 'text-dimmed line-through',
      container: 'bg-elevated/50',
    },
  },
} as const

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const timeLeft = computed(() => getTimeLeft(now.value, pair.startDate))
const daysTogether = computed<number>(() => getDaysTogether(now.value, pair.startDate))

const stats = computed(() => {
  return Object.entries(STATS_CONFIG).map(([key, config]) => ({
    ...config,
    value: key === 'days' ? daysTogether.value : config.value,
  }))
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-center">
      <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }" class="animate-fade-in translate-y-3">
        <UAvatar :src="pair.user1.avatar" :alt="pair.user1.username" />
        <UAvatar :src="pair.user2.avatar" :alt="pair.user2.username" />
      </UAvatarGroup>
    </div>

    <h2 class="text-3xl font-bold text-primary text-center animate-fade-in translate-y-3">
      {{ pair.user1.username }} и
      <span class="text-white">{{ pair.user2.username }}</span>
    </h2>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-3 w-full translate-y-3">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="rounded-lg p-4 flex flex-col items-center animate-initial animate-slide-up"
        :class="[stat.classes.container, `delay-${(index + 2) * 100}`]"
      >
        <h3
          class="text-2xl font-bold"
          :class="stat.classes.value"
        >
          {{ stat.value === null || stat.value === 0 ? '—' : stat.value }}
        </h3>
        <p class="text-sm text-center" :class="[stat.classes.label]">
          {{ stat.label.split(' ')[0] }}<br>{{ stat.label.split(' ').slice(1).join(' ') }}
        </p>
      </div>
    </div>

    <!-- Счётчик до годовщины -->
    <div
      class="w-full bg-elevated/50 rounded-lg p-4 animate-initial animate-slide-up delay-500 translate-y-3"
    >
      <h3 class="text-xl font-bold text-white mb-4 text-center">
        {{ COUNTDOWN_CONFIG.title }}
      </h3>
      <div class="grid grid-cols-4 gap-3">
        <template v-for="(unit, index) in COUNTDOWN_CONFIG.units" :key="unit">
          <div class="flex flex-col items-center">
            <div class="text-3xl font-bold text-primary">
              {{ index === 0 ? timeLeft.days
                : index === 1 ? timeLeft.hours
                  : index === 2 ? timeLeft.minutes
                    : timeLeft.seconds }}
            </div>
            <div class="text-sm text-gray-400">
              {{ unit }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Прогресс отношений -->
    <div class="grid grid-cols-3 gap-3 w-full mx-auto">
      <div
        v-for="(goal, index) in RELATIONSHIP_GOALS"
        :key="goal.days"
        class="bg-elevated/50 rounded-lg p-2 flex flex-col items-center animate-slide-up opacity-0 translate-y-3"
        :style="{ animationDelay: `${0.5 + index * 0.2}s` }"
      >
        <RelationshipProgress
          :current-days="daysTogether"
          :target-days="goal.days"
          :label="goal.label"
        />
      </div>
    </div>

    <!-- <UCarousel
      v-slot="{ item }"
      loop
      dots
      :autoplay="{ delay: 2000 }"
      :items="pair.photos"
      class="w-full max-w-md mx-auto animate-slide-up opacity-0 translate-y-3"
      style="animation-delay: 0.6s"
    >
      <div class="aspect-square w-full">
        <img
          :src="item"
          class="w-full h-full object-cover rounded-lg"
          alt="Carousel image"
        >
      </div>
    </UCarousel> -->
  </div>
</template>
