<script setup lang="ts">
import { useBackButton } from 'vue-tg'

const backButton = useBackButton()
backButton?.hide()

const activities = [
  {
    title: 'Вопросы для сближения',
    value: 'questions',
    description: '36 вопросов, которые помогут вам лучше узнать друг друга',
    icon: 'i-lucide-message-square-quote',
    color: 'rose' as const,
    progress: 12,
    total: 36,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Совместные челленджи',
    value: 'challenges',
    description: 'Ежедневные задания для укрепления отношений',
    icon: 'i-lucide-trophy',
    color: 'amber' as const,
    progress: 5,
    total: 30,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Свидания',
    value: 'dates',
    description: 'Идеи для незабываемых свиданий',
    icon: 'i-lucide-heart',
    color: 'rose' as const,
    progress: 3,
    total: 10,
    gradient: 'from-red-500 to-rose-500',
  },
  {
    title: 'Совместные цели',
    value: 'goals',
    description: 'Планируйте и достигайте целей вместе',
    icon: 'i-lucide-target',
    color: 'emerald' as const,
    progress: 2,
    total: 5,
    gradient: 'from-emerald-500 to-teal-500',
  },
]

function handleActivityClick(activity: typeof activities[0]) {
  navigateTo(`/activity/${activity.value}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">
          Активности
        </h1>
        <p class="text-muted">
          Развивайте ваши отношения вместе
        </p>
      </div>
    </div>

    <!-- Карточки активностей -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="activity in activities"
        :key="activity.title"
        class="group relative overflow-hidden rounded-2xl bg-elevated/50 p-4 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        @click="handleActivityClick(activity)"
      >
        <!-- Градиентный фон -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
          :class="`bg-gradient-to-r ${activity.gradient}`"
        />

        <div class="relative flex items-start gap-4">
          <!-- Иконка -->
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="`bg-gradient-to-r ${activity.gradient}`"
          >
            <UIcon
              :name="activity.icon"
              class="text-2xl text-white"
            />
          </div>

          <!-- Контент -->
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-white">
              {{ activity.title }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">
              {{ activity.description }}
            </p>

            <div class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-400">
                  Прогресс
                </span>
                <span class="text-sm font-medium text-white">
                  {{ activity.progress }}/{{ activity.total }}
                </span>
              </div>
              <UProgress
                :model-value="(activity.progress / activity.total) * 100"
                :color="activity.color"
                size="sm"
                class="h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
