<script setup lang="ts">
import type { Config, Stat, TimeLeft } from '~/types/stats'
import { computed, onMounted, ref } from 'vue'
import { getDaysTogether, getTimeLeft } from '~/helpers/stats'
import { usePairStore } from '~/stores/pair.store'

const pair = usePairStore()

const now = ref<Date>(new Date())

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
  setInterval(() => {
    now.value = new Date()
  }, 1000)
})

const daysTogether = computed<number>(() => getDaysTogether(now.value, pair.startDate))
const stats = computed<Stat[]>(() => [
  { label: config.stats.tasks, value: pair.stats.tasks, color: 'muted' },
  { label: config.stats.days, value: daysTogether.value, color: 'toned' },
  { label: config.stats.challenges, value: pair.stats.challenges, color: 'muted' },
])
const timeLeft = computed<TimeLeft>(() => getTimeLeft(now.value, pair.startDate))
</script>

<template>
  <div class=" space-y-4 ">

    <!-- <p>Haptics:</p>
    <ul>
        <li>Impact: <a href="javascript:Telegram.WebApp.HapticFeedback.impactOccurred('heavy');">heavy</a>, &nbsp; <a href="javascript:Telegram.WebApp.HapticFeedback.impactOccurred('light');">light</a>, &nbsp; <a href="javascript:Telegram.WebApp.HapticFeedback.impactOccurred('medium');">medium</a>, &nbsp; <a href="javascript:Telegram.WebApp.HapticFeedback.impactOccurred('rigid');">rigid</a>, &nbsp; <a href="javascript:Telegram.WebApp.HapticFeedback.impactOccurred('soft');">soft</a><br><br></li>
       
    </ul> -->
    <div class="flex justify-center">
      <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }">
        <UAvatar :src="pair.user1.avatar" :alt="pair.user1.name" />
        <UAvatar :src="pair.user2.avatar" :alt="pair.user2.name" />
      </UAvatarGroup>
    </div>

    <h2 class="text-3xl font-bold text-white text-center animate-fade-in">
      {{ pair.user1.name }} и
      <span class="text-primary">{{ pair.user2.name }}</span>
    </h2>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-4 w-full ">
      <div
        v-for="stat in stats" :key="stat.label"
        class="bg-elevated/50 rounded-lg p-4 flex flex-col items-center"
      >
        <h3
          class="text-2xl font-bold" :class="[
            stat.label === config.stats.days ? 'text-primary' : 'text-white',
          ]"
        >
          {{ stat.value }}
        </h3>
        <p :class="`text-sm text-${stat.color} text-center`">
          {{ stat.label }}
        </p>
      </div>
    </div>

    <!-- Счётчик до годовщины -->
    <div class="w-full  bg-elevated/50 rounded-lg p-4">
      <h3 class="text-xl font-bold text-white mb-4 text-center">
        {{ config.countdown.title }}
      </h3>
      <div class="grid grid-cols-4 gap-4">
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
    <UCarousel
      v-slot="{ item }"
      loop
      dots
      :autoplay="{ delay: 2000 }"
      :items="pair.photos"
      class="w-full max-w-md mx-auto"
    >
      <div class="aspect-square w-full">
        <img
          :src="item"
          class="w-full h-full object-cover rounded-lg"
          alt="Carousel image"
        >
      </div>
    </UCarousel>
  </div>
</template>
