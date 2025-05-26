<script setup lang="ts">
// Дата начала отношений
const startDate = new Date('2025-05-05')
const now = ref(new Date())

// Конфигурация текстов
const config = {
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

// Обновляем время каждую секунду
onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 1000)
})

// Вычисляем количество дней вместе
const daysTogether = computed(() => {
  const diff = now.value.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

const stats = [
  { label: config.stats.tasks, value: '24', color: 'gray' },
  { label: config.stats.days, value: daysTogether, color: 'white' },
  { label: config.stats.challenges, value: '156', color: 'gray' },
]

// Типы для timeLeft
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Вычисляем оставшееся время до годовщины
const timeLeft = computed<TimeLeft>(() => {
  // Получаем дату следующей годовщины
  const nextAnniversary = new Date(startDate)
  nextAnniversary.setFullYear(now.value.getFullYear())

  // Если годовщина в этом году уже прошла, берем следующую
  if (nextAnniversary < now.value) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }

  const diff = nextAnniversary.getTime() - now.value.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
})
</script>

<template>
  <div class="mx-auto p-4">
    <div class="flex flex-col items-center space-y-6 ">
      <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }">
        <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
      </UAvatarGroup>

      <h2 class="text-3xl font-bold text-white text-center animate-fade-in">
        Пользователь 1 и
        <span class="text-primary">Пользователь 2</span>
      </h2>

      <!-- Статистика -->
      <div class="grid grid-cols-3 gap-4 w-full max-w-md">
        <div
          v-for="stat in stats" :key="stat.label"
          class="bg-elevated/50 rounded-lg p-4 flex flex-col items-center"
        >
          <h3 class="text-2xl font-bold text-primary">
            {{ stat.value }}
          </h3>
          <p :class="`text-sm text-${stat.color} text-center`">
            {{ stat.label }}
          </p>
        </div>
      </div>

      <!-- Счётчик до годовщины -->
      <div class="w-full max-w-md bg-elevated/50 rounded-lg p-4">
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
    </div>
  </div>
</template>
