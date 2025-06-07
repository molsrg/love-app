<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

import { useBackButton } from 'vue-tg'
import QuestionsModal from '~/components/modal/QuestionsModal.vue'

const backButton = useBackButton()
backButton?.show()
backButton?.onClick(() => {
  navigateTo('/activity')
})

const overlay = useOverlay()
const toast = useToast()

const modal = overlay.create(QuestionsModal, {
  props: {
    questionId: 0,
    questionText: '',
    questionsStatus: '',
  },
})

onUnmounted(() => {
  backButton?.hide()
})

const questions = [
  {
    id: 1,
    text: 'Если бы вы могли пригласить на ужин любого человека, кто бы это был?',
    status: 'new',
  },
  {
    id: 2,
    text: 'Хотели бы вы быть знаменитым? В какой области?',
    status: 'in-progress',
    waitingFor: 'partner',
  },
  {
    id: 3,
    text: 'Перед тем как позвонить, вы репетируете то, что собираетесь сказать? Почему?',
    status: 'done',
    answeredAt: '15 марта',
  },
  {
    id: 4,
    text: 'Что для вас было бы "идеальным" днем?',
    status: 'new',
  },
  {
    id: 5,
    text: 'Когда вы в последний раз пели самому себе? А кому-то другому?',
    status: 'in-progress',
    waitingFor: 'me',
  },
]

function handleQuestionClick(id: number) {
  const question = questions.find(q => q.id === id)
  if (question) {
    modal.open({
      questionId: question.id,
      questionText: question.text,
      questionsStatus: question.status,
    })
  }
}

const items: TabsItem[] = [
  {
    label: 'Новые',
    description: 'Вопросы, которые вы еще не обсуждали',
    icon: 'i-lucide-sparkles',
    slot: 'unanswer' as const,
  },
  {
    label: 'В ожидании',
    description: 'Вопросы, которые вы начали обсуждать',
    icon: 'i-lucide-clock',
    slot: 'in-progress' as const,
  },
  {
    label: 'История',
    description: 'Вопросы, на которые вы уже ответили',
    icon: 'i-lucide-history',
    slot: 'answer' as const,
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-4">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-message-square-quote" class="text-primary mt-1" />
      <h1 class="text-2xl font-semibold">
        Вопросы для сближения
      </h1>
    </div>

    <UTabs :items="items" variant="pill">
      <template #unanswer="{ item }">
        <div class="space-y-4">
          <p class="text-highlighted mb-4">
            {{ item.description }}
          </p>
          <UCard
            v-for="question in questions.filter(q => q.status === 'new')"
            :key="question.id"
            variant="subtle"
            class="cursor-pointer transition-all active:scale-[0.98]"
            @click="handleQuestionClick(question.id)"
          >
            <p class="text-white">
              {{ question.text }}
            </p>
          </UCard>
        </div>
      </template>

      <template #in-progress="{ item }">
        <div class="space-y-4">
          <p class="text-highlighted mb-4">
            {{ item.description }}
          </p>
          <UCard
            v-for="question in questions.filter(q => q.status === 'in-progress')"
            :key="question.id"
            variant="subtle"
            class="cursor-pointer transition-all active:scale-[0.98]"
            @click="handleQuestionClick(question.id)"
          >
            <div class="space-y-2">
              <p class="text-white">
                {{ question.text }}
              </p>
              <div class="flex items-center gap-2 text-sm text-muted">
                <UIcon name="i-lucide-user" class="text-primary" />
                <span>Ожидает ответа {{ question.waitingFor === 'me' ? 'от вас' : 'от партнера' }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <template #answer="{ item }">
        <div class="space-y-4">
          <p class="text-highlighted mb-4">
            {{ item.description }}
          </p>
          <UCard
            v-for="question in questions.filter(q => q.status === 'done')"
            :key="question.id"
            variant="subtle"
            class="cursor-pointer transition-all active:scale-[0.98]"
            @click="handleQuestionClick(question.id)"
          >
            <div class="space-y-2">
              <p class="text-white">
                {{ question.text }}
              </p>
              <div class="flex items-center gap-2 text-sm text-muted">
                <UIcon name="i-lucide-calendar" class="text-primary" />
                <span>Ответили {{ question.answeredAt }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>
  </div>
</template>
