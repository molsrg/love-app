<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

import QrcodeVue from 'qrcode.vue'
import { useQrScanner } from 'vue-tg'

definePageMeta({
  layout: 'unauthorized',
})

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
const config = useRuntimeConfig()
const tgUserStore = useTgWebAppStore().initDataUnsafe.user
const selectedDate = ref<DateValue | null>(null)
const qrUrl = computed(() => `https://t.me/${config.public.botUrl}?startapp=${tgUserStore.id}_${selectedDate.value}`)
const isQrOpen = ref(false)
const { $isMobile } = useNuxtApp()
const qrScannerInstance = useQrScanner()
const qrData = ref<{ userId: string, date: string } | null>(null)

function openQrScanner(): void {
  qrScannerInstance?.show?.({ text: 'Наведите камеру на QR-код партнёра' })
}

function handleQrScan(eventData: { data: string }) {
  console.warn('QR scanned:', eventData.data)
  const [userId, date] = eventData.data.split('_')
  qrData.value = { userId, date }
  qrScannerInstance?.close?.()
}

onMounted(() => {
  qrScannerInstance?.onScan?.(handleQrScan)
})

onUnmounted(() => {
  qrScannerInstance?.close?.()
  qrScannerInstance?.offScan?.(handleQrScan)
})

const carouselItems: CarouselItem[] = [
  {
    title: 'Привет,',
    subtitle: tgUserStore.first_name,
    badge: 'И ещё многое другое ждёт тебя в LoveApp',
    main: 'Мы рады представить тебе новое приложение для отслеживания <b>ваших</b> отношений',
    features: [
      { icon: 'i-heroicons-bell', text: 'Не пропустите важные даты', color: 'text-primary' },
      { icon: 'i-heroicons-calendar', text: 'Планируйте свидания вместе', color: 'text-primary' },
      { icon: 'i-heroicons-light-bulb', text: 'Идеи для романтических вечеров', color: 'text-primary' },
      { icon: 'i-heroicons-trophy', text: 'Весёлые челленджи для двоих', color: 'text-primary' },
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
        action: openQrScanner,
      },
      secondary: {
        icon: 'i-heroicons-share',
        label: 'Поделиться моим QR',
        action: () => { isQrOpen.value = !isQrOpen.value },
      },
    },
  },
]
const { telegramSelectionChanged, telegramNotificationOccurred } = useHapticFeedback()
const items = [
  {
    title: 'Выбери дату начала отношений',
  },
  {
    title: 'Твой готовый QR-код',
  },
]

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function handleDateChange(date: any) {
  if (!date || typeof date !== 'object' || 'start' in date || Array.isArray(date))
    return
  selectedDate.value = date
  telegramSelectionChanged()
  select(1)
}

function select(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

function onSelect(index: number) {
  if (index === 1 && !selectedDate.value) {
    telegramNotificationOccurred('error')
    return
  }
  activeIndex.value = index
}
</script>

<template>
  <div>
    <div class="relative" style="height: 75vh;">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
        <UCarousel v-slot="{ item }" dots :items="carouselItems" class="w-full">
          <UCard variant="subtle" class="p-2" :ui="{ root: 'rounded-xl' }">
            <div class="space-y-4">
              <div class="text-center">
                <h2 class="text-3xl font-bold text-white animate-fade-in mb-4">
                  {{ item.title }}
                  <span class="text-primary">{{ item.subtitle }}</span>
                </h2>
                <p class="text-lg leading-relaxed animate-slide-up" v-html="item.main" />
              </div>

              <ul v-if="item.features" class="space-y-1 text-left">
                <li v-for="feature in item.features" :key="feature.text" class="flex items-center gap-2">
                  <UIcon :name="feature.icon" class="w-5 h-5" :class="[feature.color]" />
                  <span>{{ feature.text }}</span>
                </li>
              </ul>

              <div v-if="item.actions" class="space-y-3">
                <UButton
                  v-if="item.actions.primary && $isMobile"
                  :icon="item.actions.primary.icon"
                  :label="item.actions.primary.label"
                  size="xl"
                  variant="soft"
                  class="w-full justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="item.actions.primary.action"
                />
                <UButton
                  v-if="item.actions.secondary"
                  :icon="item.actions.secondary.icon"
                  :label="item.actions.secondary.label"
                  size="xl"
                  color="neutral"
                  variant="subtle"
                  class="w-full justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="item.actions.secondary.action"
                />

                <!-- <UButton
                  label="Перейти в ожидание (тест)"
                  size="xl"
                  color="neutral"
                  variant="subtle"
                  class="w-full justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="navigateTo('/wait')"
                />

                <UButton
                  label="Перейти в инициализацию (для хоста, тест)"
                  size="xl"
                  color="neutral"
                  variant="subtle"
                  class="w-full justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="navigateTo('/initialization')"
                /> -->
              </div>

              <UBadge
                v-if="item.badge"
                class="w-full"
                variant="soft"
                :label="item.badge"
                size="xl"
                :ui="{
                  label: 'whitespace-normal text-center ',
                }"
              />

              <div v-if="item.call" class="flex items-center justify-center gap-2 text-sm text-gray-400">
                <UIcon name="i-heroicons-users" class="w-4 h-4" />
                <p>{{ item.call }}</p>
              </div>
            </div>
          </UCard>
        </UCarousel>
      </div>
    </div>

    <UDrawer v-model:open="isQrOpen">
      <template #content>
        <div class="flex flex-col items-center px-6 py-3 space-y-4">
          <UCarousel
            ref="carousel"
            v-slot="{ item }"
            :items="items"
            class="w-full"
            @select="onSelect"
          >
            <UCard variant="subtle" :ui="{ root: 'rounded-xl h-85' }">
              <template #header>
                <h2 class="text-lg font-semibold text-white text-center">
                  {{ item.title }}
                </h2>
              </template>

              <!-- Первый слайд - выбор даты -->
              <div v-if="activeIndex === 0" class="space-y-4">
                <UCalendar
                  v-model="selectedDate"
                  :fixed-weeks="false"
                  class="w-full"
                  @update:model-value="handleDateChange"
                />
              </div>

              <!-- Второй слайд - настройки -->
              <div v-else class="flex flex-col items-center gap-4">
                <QrcodeVue :value="qrUrl" :size="200" />

                <div v-if="qrData" class="text-center space-y-2">
                  <p class="text-primary">
                    Данные из QR-кода:
                  </p>
                  <p>ID пользователя: {{ qrData.userId }}</p>
                  <p>Дата: {{ qrData.date }}</p>
                </div>

                <div class="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <UIcon name="i-heroicons-users" class="w-4 h-4" />
                  <p>Попробуй прямо сейчас! </p>
                </div>
              </div>
            </UCard>
          </UCarousel>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
