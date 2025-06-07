<script setup lang="ts">
// definePageMeta({
//   layout: 'unauthorized',
// })

import type { DateValue } from '@internationalized/date'
import type { Theme } from '~/types/settings'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { THEMES } from '~/config/settings'

const items = [
  {
    title: 'Выбери дату начала отношений',
  },
  {
    title: 'Настройки приложения',
  },
]

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)
const selectedDate = ref<DateValue | null>(null)
const appConfig = useAppConfig()
const activeTheme = ref(appConfig.ui.colors.primary)
const isSubmitting = ref(false)
const toast = useToast()
const { locale } = useI18n()

const isFormValid = computed(() => {
  return selectedDate.value && activeTheme.value && locale.value
})

async function handleSubmit() {
  if (!isFormValid.value)
    return

  isSubmitting.value = true
  handleHapticFeedback()

  try {
    // Симуляция запроса к бэкенду
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Сохраняем настройки
    const storage = useStorage('settings', {
      startDate: selectedDate.value,
      theme: activeTheme.value,
      language: locale.value,
    })

    console.warn(selectedDate.value, activeTheme.value, locale.value)

    await storage.value

    toast.add({
      title: 'Настройки сохранены',
      description: 'Ваши настройки успешно применены',
      color: 'success',
    })

    // Переходим на главную страницу
    navigateTo('/')
  }
  catch (error) {
    toast.add({
      title: 'Ошибка',
      description: error,
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false
  }
}

function handleDateChange(date: any) {
  if (!date || typeof date !== 'object' || 'start' in date || Array.isArray(date))
    return
  selectedDate.value = date
  handleHapticFeedback()
  select(1)
}

function handleHapticFeedback() {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged()
  }
}

async function changeTheme(theme: Theme) {
  if (!appConfig?.ui?.colors)
    return

  const storage = useStorage('theme', theme.value)
  await storage.value
  activeTheme.value = theme.value
  appConfig.ui.colors.primary = theme.value
  handleHapticFeedback()
}

function select(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

function onSelect(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="relative" style="height: 75vh;">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        dots
        :items="items"
        class="w-full"
        @select="onSelect"
      >
        <UCard variant="subtle" class="p-2" :ui="{ root: 'rounded-xl h-95' }">
          <template #header>
            <h2 class="text-lg font-semibold text-white text-center">
              {{ item.title }}
            </h2>
          </template>

          <!-- Первый слайд - выбор даты -->
          <div v-if="activeIndex === 0" class="space-y-4">
            <UCalendar
              :model-value="selectedDate"
              class="w-full"
              @update:model-value="handleDateChange"
            />
          </div>

          <!-- Второй слайд - настройки -->
          <div v-else class="space-y-6">
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Язык приложения</label>
              <USelect
                v-model="locale"
                :items="[
                  { label: 'Русский', value: 'ru' },
                  { label: 'English', value: 'en' },
                ]"
                size="lg"
                class="w-full"
                @update:model-value="handleHapticFeedback"
              />
            </div>

            <div>
              <label class="text-sm text-gray-400 mb-1 block">Выберите основной цвет</label>
              <div class="flex flex-wrap gap-2 justify-center w-full">
                <UButton
                  v-for="theme in THEMES"
                  :key="theme.value"
                  color="neutral"
                  variant="subtle"
                  class="flex-1"
                  :class="{ 'ring-1 ring-primary': activeTheme === theme.value }"
                  :label="theme.name"
                  @click="changeTheme(theme)"
                >
                  <template #leading>
                    <UChip :color="theme.value as any" size="sm" />
                  </template>
                </UButton>
              </div>
            </div>

            <div class="flex justify-center pt-4">
              <UButton
                color="primary"
                size="lg"
                :loading="isSubmitting"
                :disabled="!isFormValid || isSubmitting"
                @click="handleSubmit"
              >
                {{ isSubmitting ? 'Сохранение...' : 'Завершить' }}
              </UButton>
            </div>
          </div>
        </UCard>
      </UCarousel>
    </div>
  </div>
</template>

<!-- <style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style> -->
