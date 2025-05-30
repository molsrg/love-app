<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { useQrScanner } from 'vue-tg'
import type { DateValue } from '@internationalized/date'
import { createDateFormatter, createInitialDate, formatCalendarDate } from '~/helpers/date.helper'
import { THEMES } from '~/config/settings'
import type { Theme } from '~/types/settings'
import { useStorage } from '@vueuse/core'

// definePageMeta({
//   layout: 'unauthorized',
// })

interface CarouselItem {
  title: string
  subtitle: string
  main: string
  badge?: string
  call?: string
  features?: {
    icon: string
    text: string
    color: string
  }[]
  actions?: {
    primary?: {
      icon: string
      label: string
      action: () => void
    }
    secondary?: {
      icon: string
      label: string
      action: () => void
    }
  }
}
const qrValue = 'https://loveapp.com/pair/unique-user-id'
const open = ref(false)
const { $isMobile } = useNuxtApp()
const qrScanner = useQrScanner()

const appConfig = useAppConfig()
const dateFormatter = createDateFormatter()
const selectedDate = shallowRef(createInitialDate())
const activeTheme = ref(appConfig.ui.colors.primary)
const currentStep = ref(1)
const isCalendarPopoverOpen = ref(false)

const formattedSelectedDate = computed(() =>
  selectedDate.value ? formatCalendarDate(selectedDate.value, dateFormatter) : 'Выберите дату',
)

const activeThemeName = computed(() =>
  THEMES.find((theme: Theme) => theme.value === activeTheme.value)?.name || 'Выбрать тему',
)

function handleDateChange(date: DateValue | null) {
  if (!date)
    return
  selectedDate.value = date
  handleHapticFeedback()
  isCalendarPopoverOpen.value = false
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

function nextStep() {
  handleHapticFeedback()
  currentStep.value++
}

function prevStep() {
  handleHapticFeedback()
  currentStep.value--
}

function finishInitialization() {
  handleHapticFeedback()
  // TODO: Save all settings and navigate to main page
  navigateTo('/')
}

function startScanner(): void {
  qrScanner?.show({ text: 'Наведите камеру на QR-код партнёра' })
}

qrScanner?.onScan((eventData: { data: string }) => {
  console.log(data)

  qrScanner?.close()
  navigateTo('/wait')
})

const items: CarouselItem[] = [
  {
    title: 'Привет,',
    subtitle: 'Sergey',
    badge: 'И ещё многое другое ждёт тебя в LoveApp',
    main: 'Мы рады представить тебе новое приложение для отслеживания <b>ваших</b> отношений',
    features: [
      {
        icon: 'i-heroicons-bell',
        text: 'Не пропустите важные даты',
        color: 'text-primary',
      },
      {
        icon: 'i-heroicons-calendar',
        text: 'Планируйте свидания вместе',
        color: 'text-primary',
      },
      {
        icon: 'i-heroicons-light-bulb',
        text: 'Идеи для романтических вечеров',
        color: 'text-primary',
      },
      {
        icon: 'i-heroicons-trophy',
        text: 'Весёлые челленджи для двоих',
        color: 'text-primary',
      },
    ],
  },
  {
    title: 'Создайте вашу',
    subtitle: 'пару',
    main: 'Просто отсканируйте QR-код партнёра или поделитесь своим',
    call: 'Уже более 1000 пар вместе с нами',
    actions: {
      primary: {
        icon: 'i-heroicons-qr-code',
        label: 'Сканировать QR партнёра',
        action: startScanner,
      },
      secondary: {
        icon: 'i-heroicons-share',
        label: 'Поделиться моим QR',
        action: () => open.value = !open.value,
      },
    },
  },
]

const value = ref('')
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 flex items-center justify-center p-4">
      <UCard variant="subtle" class="w-full max-w-md">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">
              {{ currentStep === 1 ? 'Дата начала отношений' : 'Настройки приложения' }}
            </h2>
            <UBadge color="primary" variant="subtle">
              Шаг {{ currentStep }}/2
            </UBadge>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Step 1: Date Selection -->
          <div v-if="currentStep === 1" class="space-y-4">
            <p class="text-gray-400">
              Выберите дату, когда вы начали встречаться
            </p>
            
            <UPopover v-model:open="isCalendarPopoverOpen" arrow>
              <UButton
                class="w-full h-[36px]"
                icon="i-lucide-calendar"
                color="neutral"
                variant="subtle"
              >
                {{ formattedSelectedDate }}
              </UButton>

              <template #content>
                <UCalendar
                  v-model="selectedDate"
                  class="p-2 w-full"
                  @update:model-value="handleDateChange"
                />
              </template>
            </UPopover>
          </div>

          <!-- Step 2: Language and Theme -->
          <div v-if="currentStep === 2" class="space-y-4">
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Язык приложения</label>
              <USelect
                v-model="$i18n.locale"
                :options="[
                  { label: 'Русский', value: 'ru' },
                  { label: 'English', value: 'en' }
                ]"
                size="lg"
                class="w-full"
              />
            </div>

            <div>
              <label class="text-sm text-gray-400 mb-1 block">Цветовая тема</label>
              <div class="grid grid-cols-2 gap-2">
                <UButton
                  v-for="theme in THEMES"
                  :key="theme.value"
                  color="neutral"
                  variant="subtle"
                  class="text-center"
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
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              v-if="currentStep > 1"
              color="gray"
              variant="ghost"
              @click="prevStep"
            >
              Назад
            </UButton>
            <UButton
              v-if="currentStep < 2"
              color="primary"
              class="ml-auto"
              @click="nextStep"
            >
              Далее
            </UButton>
            <UButton
              v-else
              color="primary"
              class="ml-auto"
              @click="finishInitialization"
            >
              Завершить
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>

  <UDrawer v-model:open="open">
    <template #content>
      <div class="flex flex-col items-center p-6 space-y-4">
        <QrcodeVue :value="qrValue" :size="200" />
      </div>
    </template>
  </UDrawer>
</template>

<style>
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
</style>
