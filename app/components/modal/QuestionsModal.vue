<script setup lang="ts">
const props = defineProps<{ 
  questionId: number
  questionText: string 
  questionsStatus: string
}>()
const emit = defineEmits<{ close: [boolean] }>()

const myAnswer = ref('')
const partnerAnswer = ref('')

function handleSubmit() {
  console.log('Submitting answer:', myAnswer.value)
  emit('close', true)
}
</script>

<template>
  <UModal
  fullscreen
    :close="{ onClick: () => emit('close', false) }"
    :title="questionText"
  >
    <template #body>
      <div class="flex flex-col gap-6">
        <!-- Новый вопрос -->
        <div v-if="questionsStatus === 'new'" class="space-y-4">
          <UTextarea
            v-model="myAnswer"
            placeholder="Введите ваш ответ..."
            :rows="4"
            class="w-full"
          />
        </div>

        <!-- В процессе -->
        <div v-if="questionsStatus === 'in-progress'" class="space-y-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ваш ответ</span>
            </div>
            <UTextarea
              v-model="myAnswer"
              placeholder="Введите ваш ответ..."
              :rows="4"
              class="w-full"
            />
          </div>
        </div>

        <!-- Завершен -->
        <div v-if="questionsStatus === 'done'" class="space-y-6">
          <!-- Мой ответ -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ваш ответ</span>
            </div>
            <UTextarea
              disabled
              v-model="myAnswer"
              :rows="4"
              class="w-full"
            />
          </div>

          <!-- Ответ партнера -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Ответ партнера</span>
            </div>
            <UTextarea
              disabled
              v-model="partnerAnswer"
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
          v-if="questionsStatus === 'new' || questionsStatus === 'in-progress'"
          label="Отправить" 
          :disabled="!myAnswer"
          @click="handleSubmit" 
        />
      </div>
    </template>
  </UModal>
</template>
