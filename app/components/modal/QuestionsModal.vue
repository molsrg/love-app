<script setup lang="ts">
interface Question {
  id: number
  text: string
  status: 'new' | 'in-progress' | 'done'
  waitingFor: 'me' | 'partner'
  myAnswer: string
  partnerAnswer: string | null
  createdAt: string
}

const props = defineProps<{ 
  questionId: number
  questionText: string 
}>()
const emit = defineEmits<{ close: [boolean] }>()

const question = ref<Question | null>(null)

// Фейковый запрос к бэкенду
async function fetchQuestion(): Promise<Question> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 0))
  
  // Фейковый ответ
  return {
    id: props.questionId,
    text: props.questionText,
    status: 'new',
    waitingFor: 'me',
    myAnswer: 'Мой ответ на вопрос',
    partnerAnswer: 'Ответ партнера на вопрос',
    createdAt: new Date().toISOString(),
  }
}

// Загружаем данные при открытии модалки
onMounted(async () => {
  question.value = await fetchQuestion()
  console.warn('Question data:', question.value)
})

function handleSubmit() {
  if (!question.value) return
  
  console.log('Submitting answer:', question.value.myAnswer)
  emit('close', true)
}
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="questionText"
  >
    <template #body>
      <div class="flex flex-col gap-6">
        <!-- Новый вопрос -->
        <div v-if="question?.status === 'new'" class="space-y-4">
          <UTextarea
            v-model="question.myAnswer"
            placeholder="Введите ваш ответ..."
            :rows="4"
            class="w-full"
          />
        </div>

        <!-- В процессе -->
        <div v-if="question?.status === 'in-progress'" class="space-y-6">
          <!-- Мой ответ -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ваш ответ</span>
            </div>
            <UTextarea
              :disabled="question.waitingFor === 'partner'"
              v-model="question.myAnswer"
              placeholder="Введите ваш ответ..."
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Ответ партнера (если ожидаем от партнера) -->
          <div v-if="question.waitingFor === 'partner'" class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ответ партнера</span>
              <UIcon name="i-lucide-help-circle" class="text-primary" />
            </div>
            <p class="text-white">Партнёр ещё не ответил</p>
          </div>
        </div>

        <!-- Завершен -->
        <div v-if="question?.status === 'done'" class="space-y-6">
          <!-- Мой ответ -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ваш ответ</span>
              <span class="text-xs">• {{ new Date(question.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}</span>
            </div>
            <UTextarea
              disabled
              v-model="question.myAnswer"
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Ответ партнера -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ответ партнера</span>
              <span class="text-xs">• {{ new Date(question.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}</span>
            </div>
            <UTextarea
              disabled
              v-model="question.partnerAnswer"
              :rows="4"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" variant="subtle" label="Закрыть" @click="emit('close', false)" />
        <UButton 
          v-if="question?.status === 'new' || (question?.status === 'in-progress' && question?.waitingFor === 'me')"
          label="Отправить" 
          :disabled="!question.myAnswer"
          @click="handleSubmit" 
        />
      </div>
    </template>
  </UModal>
</template>
