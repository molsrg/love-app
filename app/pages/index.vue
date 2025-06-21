<script setup lang="ts">
import { RelationshipProgress } from '~/components/progress'
import { COUNTDOWN_CONFIG, RELATIONSHIP_GOALS, STATS_CONFIG } from '~/config/index'
import { getDaysTogether, getTimeLeft } from '~/helpers/stats'

const { t } = useI18n()
const pairStore = usePairStore()
const now = ref<Date>(new Date())
let intervalId: ReturnType<typeof setInterval>

const { vibrate } = useVibrate({ pattern: [300, 100, 300] })

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const timeLeft = computed(() => getTimeLeft(now.value, pairStore.startDate))
const daysTogether = computed<number>(() => getDaysTogether(now.value, pairStore.startDate))

const stats = computed(() => {
  const config = { ...STATS_CONFIG }
  if (config.days) {
    config.days = {
      ...config.days,
      value: daysTogether.value,
    }
  }
  return config
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-center">
      <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }" class="animate-fade-in translate-y-3">
        <UAvatar :src="pairStore.user1.avatar" :alt="pairStore.user1.username" />
        <UAvatar :src="pairStore.user2.avatar" :alt="pairStore.user2.username" />
      </UAvatarGroup>
    </div>

    <h2 class="text-3xl font-bold text-primary text-center animate-fade-in translate-y-3 break-all">
      {{ pairStore.user1.username }} и
      <span class="text-white">{{ pairStore.user2.username }}</span>
    </h2>

    <div class="flex justify-center py-4">
      <button
        class="p-4 rounded-full bg-elevated/50 text-primary transition-transform duration-200 active:scale-90"
        aria-label="Vibrate"
        @click="vibrate()"
      >
        <UIcon name="i-heroicons-heart-20-solid" class="h-10 w-10" />
      </button>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-3 w-full translate-y-3">
      <div
        v-for="(stat) in stats"
        :key="stat.label"
        class="rounded-lg p-4 flex flex-col items-center animate-initial animate-slide-up"
        :class="[stat.classes.container]"
      >
        <h3
          class="text-2xl font-bold"
          :class="stat.classes.value"
        >
          {{ stat.value === null || stat.value === 0 ? (stat.textValue ? t(stat.textValue) : '—') : stat.value }}
        </h3>
        <p class="text-sm text-center" :class="[stat.classes.label]">
          {{ t(stat.label).split(' ')[0] }}<br>{{ t(stat.label).split(' ').slice(1).join(' ') }}
        </p>
      </div>
    </div>

    <!-- Счётчик до годовщины -->
    <div
      class="w-full bg-elevated/50 rounded-lg p-4 animate-initial animate-slide-up delay-500 translate-y-3"
    >
      <h3 class="text-xl font-bold text-white mb-4 text-center">
        {{ t(COUNTDOWN_CONFIG.title) }}
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
              {{ t(unit) }}
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
          :label="t(goal.label)"
        />
      </div>
    </div>

    <!-- <UCarousel
      v-slot="{ item }"
      loop
      dots
      :autoplay="{ delay: 2000 }"
      :items="pairStore.photos"
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
