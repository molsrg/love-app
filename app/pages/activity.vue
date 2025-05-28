<script setup lang="ts">
const activities = [
  {
    title: 'Вопросы для сближения',
    description: '36 вопросов, которые помогут вам лучше узнать друг друга',
    icon: 'i-lucide-message-square-quote',
    color: 'rose',
    progress: 12,
    total: 36,
  },
  {
    title: 'Совместные челленджи',
    description: 'Ежедневные задания для укрепления отношений',
    icon: 'i-lucide-trophy',
    color: 'amber',
    progress: 5,
    total: 30,
  },
  {
    title: 'Свидания',
    description: 'Идеи для незабываемых свиданий',
    icon: 'i-lucide-heart',
    color: 'red',
    progress: 3,
    total: 10,
  },
  {
    title: 'Совместные цели',
    description: 'Планируйте и достигайте целей вместе',
    icon: 'i-lucide-target',
    color: 'emerald',
    progress: 2,
    total: 5,
  },
]

const currentActivity = ref(activities[0])
const showQuestions = ref(false)

const questions = [
  'Если бы вы могли пригласить на ужин любого человека, кто бы это был?',
  'Хотели бы вы быть знаменитым? В какой области?',
  'Перед тем как позвонить, вы репетируете то, что собираетесь сказать? Почему?',
  'Что для вас было бы "идеальным" днем?',
  'Когда вы в последний раз пели самому себе? А кому-то другому?',
]

const currentQuestion = ref(0)
const answers = ref<string[]>([])

function nextQuestion() {
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  }
}

function previousQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}
</script>

<template>
  <div class="space-y-4 ">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">
        Активности
      </h1>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        variant="soft"
      >
        Новая активность
      </UButton>
    </div>

    <!-- Карточки активностей -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard
        v-for="activity in activities"
        :key="activity.title"
        :ui="{
          base: 'transition-all duration-200 hover:scale-[1.02] cursor-pointer',
          body: { padding: 'p-4' },
        }"
        @click="currentActivity = activity; showQuestions = true"
      >
        <div class="flex items-start gap-4">
          <UIcon
            :name="activity.icon"
            class="text-2xl"
            :class="`text-${activity.color}-500`"
          />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">
              {{ activity.title }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">
              {{ activity.description }}
            </p>
            <div class="mt-3">
              <UProgress
                :value="(activity.progress / activity.total) * 100"
                :color="activity.color"
                size="sm"
              />
              <p class="text-xs text-gray-400 mt-1">
                Прогресс: {{ activity.progress }}/{{ activity.total }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
