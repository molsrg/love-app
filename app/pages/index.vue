<script setup lang="ts">
import type { Config, Stat, TimeLeft } from '~/types/stats'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import RelationshipProgress from '~/components/progress/RelationshipProgress.vue'
import { getDaysTogether, getTimeLeft } from '~/helpers/stats'
import { usePairStore } from '~/stores/pair.store'

const pair = usePairStore()

const now = ref<Date>(new Date())
let intervalId: ReturnType<typeof setInterval>

const RELATIONSHIP_GOALS = [
  { days: 30, label: '1 месяц' },
  { days: 100, label: '100 дней' },
  { days: 180, label: 'полгода' },
  { days: 365, label: 'год' },
  { days: 1460, label: 'три года' },
  { days: 5840, label: 'пять лет' },
]

const config: Config = {
  countdown: {
    title: 'До годовщины осталось',
    units: ['дней', 'часов', 'минут', 'секунд'],
  },
  stats: {
    tasks: 'выполненных заданий',
    days: 'дней вместе',
    challenges: 'совместных челденджей',
  },
}

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

const timeLeft = computed<TimeLeft>(() => getTimeLeft(now.value, pair.startDate))
const daysTogether = computed<number>(() => getDaysTogether(now.value, pair.startDate))
const stats = computed<Stat[]>(() => {
  const statsArray: Stat[] = [
    { label: config.stats.tasks, value: 0, color: 'muted' },
    { label: config.stats.days, value: daysTogether.value, color: 'toned' },
    { label: config.stats.challenges, value: 0, color: 'muted' },
  ]
  return statsArray
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-center">
      <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }" class="animate-fade-in">
        <UAvatar :src="pair.user1.avatar" :alt="pair.user1.username" />
        <UAvatar :src="pair.user2.avatar" :alt="pair.user2.username" />
      </UAvatarGroup>
    </div>

    <h2 class="text-3xl font-bold text-primary text-center animate-fade-in">
      {{ pair.user1.username }} и
      <span class="text-white">{{ pair.user2.username }}</span>
    </h2>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-3 w-full">
      <div
        v-for="(stat, index) in stats" :key="stat.label"
        class="bg-elevated/50 rounded-lg p-4 flex flex-col items-center animate-slide-up opacity-0 translate-y-3"
        :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
      >
        <h3
          class="text-2xl font-bold" :class="[
            stat.label === config.stats.days ? 'text-primary' : 'text-white',
          ]"
        >
          {{ stat.value === null || stat.value === 0 ? '—' : stat.value }}
        </h3>
        <p :class="`text-sm text-${stat.color} text-center`">
          {{ stat.label.split(' ')[0] }}<br>{{ stat.label.split(' ').slice(1).join(' ') }}
        </p>
      </div>
    </div>

    <!-- Счётчик до годовщины -->
    <div class="w-full bg-elevated/50 rounded-lg p-4 animate-slide-up opacity-0 translate-y-3" style="animation-delay: 0.5s">
      <h3 class="text-xl font-bold text-white mb-4 text-center">
        {{ config.countdown.title }}
      </h3>
      <div class="grid grid-cols-4 gap-3">
        <template v-for="(unit, index) in config.countdown.units" :key="unit">
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
    <div class="grid grid-cols-3 gap-3 w-full  mx-auto">
      <div
        v-for="(goal, index) in RELATIONSHIP_GOALS" :key="goal.days"
        class="bg-elevated/50 rounded-lg p-2 flex flex-col items-center animate-slide-up opacity-0 translate-y-3"
        :style="{ animationDelay: `${0.5 + index * 0.1}s` }"
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
