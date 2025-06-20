<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { StepperItem } from '@nuxt/ui'

import QrcodeVue from 'qrcode.vue'
import { useQrScanner } from 'vue-tg'

import { carouselItems } from '~/constants/app/connect'
import { isNextDateDisabled } from '~/helpers/calendar.helper'

definePageMeta({
  layout: 'unauthorized',
})

const { t } = useI18n()
const config = useRuntimeConfig()
const tgUserStore = useTgWebAppStore().initDataUnsafe.user
const selectedDate = ref<DateValue | null>(null)
const qrUrl = computed(() => `https://t.me/${config.public.botUrl}?startapp=${tgUserStore.id}_${selectedDate.value}`)
const isQrOpen = ref(false)
const { $isMobile } = useNuxtApp()
const { telegramSelectionChanged, telegramNotificationOccurred } = useHapticFeedback()

const qrScanner = useQrScanner()
const dataQR = ref<{ data: string } | null>(null)

function startScanner(): void {
  qrScanner?.show({ text: t('connect.scanner.text') })
}

type ActionType = 'startScanner' | 'shareQR'
const actionHandlers: Record<ActionType, () => void> = {
  startScanner,
  shareQR() { isQrOpen.value = !isQrOpen.value },
}

qrScanner?.onScan((eventData: { data: string }) => {
  dataQR.value = eventData
  const qrText = eventData.data
  const startParam = qrText.split('startapp=')[1]

  if (startParam) {
    const [userId, date] = startParam.split('_')
    if (userId && date) {
      const tgWebAppStore = useTgWebAppStore()
      const startParamRegex = /^\d+_\d{4}-\d{2}-\d{2}$/

      if (startParamRegex.test(startParam)) {
        if (!tgWebAppStore.userInPair) {
          console.warn('Valid QR code detected, user not paired')
          tgWebAppStore.isCreatePair = true

          tgWebAppStore.startParam = startParam
          navigateTo('/wait')
        }
        else {
          console.warn('User already paired, ignoring QR code')
          tgWebAppStore.isCreatePair = false
        }
      }
      else {
        console.warn('Invalid QR code format:', startParam)
        tgWebAppStore.isCreatePair = false
      }

      qrScanner?.close()
    }
  }
})

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function handleDateChange(date: any) {
  selectedDate.value = date
  telegramSelectionChanged()
  select(1)
}

function select(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

// Map carousel items with translations and actions
const mappedCarouselItems = computed(() => carouselItems.map(item => ({
  ...item,
  subtitle: item.subtitle === '{name}' ? tgUserStore?.first_name ?? '' : t(item.subtitle),
})))

const itemsStep: StepperItem[] = [
  {
    title: t('connect.steps.date.title'),
    icon: 'i-material-symbols-calendar-apps-script',
    slot: 'date' as const,
  },
  {
    title: t('connect.steps.qr.title'),
    icon: 'i-material-symbols-qr-code',
    slot: 'qr' as const,
  },
]

const stepper = useTemplateRef<{ hasPrev: boolean }>('stepper')
</script>

<template>
  <div>
    <div class="relative" style="height: 75vh;">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
        <UCarousel v-slot="{ item }" dots :items="mappedCarouselItems" class="w-full">
          <UCard variant="subtle" class="p-2" :ui="{ root: 'rounded-xl' }">
            <div class="space-y-4 animate-fade-in">
              <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-4">
                  {{ t(item.title) }}
                  <span class="text-primary">{{ item.subtitle }}</span>
                </h2>
                <p class="text-lg leading-relaxed" v-html="t(item.main)" />
              </div>

              <ul v-if="item.features" class="space-y-1 text-left">
                <li v-for="feature in item.features" :key="feature.text" class="flex items-center gap-2">
                  <UIcon :name="feature.icon" class="w-5 h-5" :class="[feature.color]" />
                  <span>{{ t(feature.text) }}</span>
                </li>
              </ul>

              <div v-if="item.actions" class="space-y-3">
                <UButton
                  v-if="item.actions.primary && $isMobile"
                  :icon="item.actions.primary.icon"
                  :label="t(item.actions.primary.label)"
                  size="xl"
                  variant="soft"
                  class="w-full justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="actionHandlers[item.actions.primary.action as ActionType]()"
                />
                <UButton
                  v-if="item.actions.secondary"
                  :icon="item.actions.secondary.icon"
                  :label="t(item.actions.secondary.label)"
                  size="xl"
                  color="neutral"
                  variant="subtle"
                  class="w-full justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="actionHandlers[item.actions.secondary.action as ActionType]()"
                />
              </div>
              <UBadge
                v-if="item.badge"
                class="w-full"
                variant="soft"
                :label="t(item.badge)"
                size="xl"
                :ui="{
                  label: 'whitespace-normal text-center',
                }"
              />

              <div v-if="item.call" class="flex items-center justify-center gap-2 text-sm text-gray-400">
                <UIcon name="i-heroicons-users" class="w-4 h-4" />
                <p>{{ t(item.call) }}</p>
              </div>
            </div>
          </UCard>
        </UCarousel>
      </div>
    </div>

    <UDrawer v-model:open="isQrOpen">
      <template #content>
        <UStepper ref="stepper" v-model="activeIndex" :disabled="!stepper?.hasPrev" :items="itemsStep" class="w-full mt-4 animate-fade-in">
          <template #date>
            <UCard variant="subtle" class="animate-fade-in">
              <UCalendar
                v-model="selectedDate"
                :is-date-disabled="isNextDateDisabled"
                :fixed-weeks="false"
                class="w-full"
                @update:model-value="handleDateChange"
              />
            </UCard>
          </template>
          <template #qr>
            <UCard variant="subtle" class="animate-fade-in">
              <div class="flex flex-col items-center gap-4">
                <QrcodeVue :value="qrUrl" :size="200" />
              </div>
            </UCard>
          </template>
        </UStepper>
      </template>
    </UDrawer>
  </div>
</template>
