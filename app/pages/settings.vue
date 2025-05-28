<script setup lang="ts">
import type { CalendarDate, DateValue } from '@internationalized/date'
import type { Profile, Theme } from '~/types/settings'
import { useCloudStorage } from 'vue-tg/latest'
import { SETTINGS_SECTIONS, THEMES } from '~/config/settings'
import { createDateFormatter, createInitialDate, formatCalendarDate } from '~/helpers/date.helper'

const props = defineProps<{
  title: string
}>()

const appConfig = useAppConfig()

const userProfile = ref<Profile>({
  name: 'Пользователь 1',
  partnerName: 'Пользователь 2',
  startDate: '2025-05-05',
  theme: 'dark',
})

const activeTheme = ref(appConfig.ui.colors.primary)
const isThemePopoverOpen = ref(false)
const isCalendarPopoverOpen = ref(false)

const dateFormatter = createDateFormatter()
const selectedDate = shallowRef(createInitialDate())

const isHostTransferEnabled = ref(false)

function handleAvatarClick() {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  input?.click()
}

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    console.warn('Selected avatar file:', file)
    // TODO: Здесь будет логика загрузки файла на сервер
  }
}

async function changeTheme(theme: Theme): void {
  if (!appConfig?.ui?.colors)
    return

  await useCloudStorage().setItem('theme', theme.value)
  activeTheme.value = theme.value
  appConfig.ui.colors.primary = theme.value
  isThemePopoverOpen.value = !isThemePopoverOpen.value
}

function handleHostTransfer() {
  if (isHostTransferEnabled.value) {
    console.log('Transferring host rights to partner')
    // TODO: Здесь будет логика передачи прав хоста
  }
}

function handleBreakUp() {
  if (confirm('Вы уверены, что хотите разорвать пару?')) {
    console.log('Breaking up the pair')
    // TODO: Здесь будет логика разрыва пары
  }
}

const formattedSelectedDate = computed(() =>
  selectedDate.value ? formatCalendarDate(selectedDate.value, dateFormatter) : 'Select a date',
)

const activeThemeName = computed(() =>
  THEMES.find((theme: Theme) => theme.value === activeTheme.value)?.name || 'Выбрать тему',
)

watch(isHostTransferEnabled, (newValue) => {
  if (newValue) {
    handleHostTransfer()
  }
})

// Методы для работы с датой
function handleDateChange(date: DateValue | null) {
  if (!date)
    return
  selectedDate.value = date as any
  console.warn('New date selected:', formatCalendarDate(date as any, dateFormatter))
  isCalendarPopoverOpen.value = false
}

const toast = useToast()

function showToast() {
  toast.add({
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
  })
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold text-white">
      {{ $t('settings.title') }}
    </h1>
    <UCard variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="SETTINGS_SECTIONS.profile.icon" class="text-primary size-6" />
          <h2 class="text-lg font-semibold text-white">
            {{ SETTINGS_SECTIONS.profile.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.profile.name') }}</label>
          <UInput
            v-model="userProfile.name"
            size="lg"
            class="w-full"
            :placeholder="$t('settings.profile.namePlaceholder')"
          />
          <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.profile.avatar') }}</label>
          <UButton
            class="w-full h-[36px] flex items-center"
            :avatar="{
              src: 'https://github.com/benjamincanac.png',
            }"
            size="md"
            color="neutral"
            variant="subtle"
            @click="handleAvatarClick"
          >
            {{ $t('settings.profile.changeAvatar') }}
          </UButton>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          >
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.profile.theme') }}</label>

          <UPopover v-model:open="isThemePopoverOpen" arrow>
            <UButton class="w-full h-[36px]" icon="i-lucide-palette" color="neutral" variant="subtle">
              {{ activeThemeName }}
            </UButton>

            <template #content>
              <div class="p-2">
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
            </template>
          </UPopover>
        </div>
      </div>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="SETTINGS_SECTIONS.pair.icon" class="text-primary size-6" />
          <h2 class="text-lg font-semibold text-white">
            {{ SETTINGS_SECTIONS.pair.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.partner.name') }}</label>
          <UInput
            v-model="userProfile.partnerName"
            disabled
            size="lg"
            trailing-icon="i-material-symbols-lock-outline"
            class="w-full"
            :placeholder="$t('settings.partner.namePlaceholder')"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.partner.startDate') }}</label>
          <UPopover v-model:open="isCalendarPopoverOpen" arrow>
            <UButton class="w-full h-[36px]" :ui="{ trailingIcon: 'ml-auto' }" :disabled="isHostTransferEnabled" color="neutral" variant="subtle" icon="i-lucide-calendar" :trailing-icon="isHostTransferEnabled ? 'i-material-symbols-lock-outline' : ''">
              {{ formattedSelectedDate }}
            </UButton>

            <template #content>
              <UCalendar v-model="selectedDate" class="p-2 w-full" @update:model-value="handleDateChange" />
            </template>
          </UPopover>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              {{ $t('settings.partner.transferHost') }}
            </h3>
            <p class="text-sm text-gray-400">
              {{ $t('settings.partner.hostDescription') }}
            </p>
          </div>

          <UCheckbox v-model="isHostTransferEnabled" size="lg" class="mr-1" />
        </div>

        <div class="flex justify-center">
          <UButton
            leading-icon="i-material-symbols:heart-broken-outline"
            class="h-[36px]"
            color="error"
            variant="subtle"
            :label="$t('settings.partner.breakUp')"
            size="lg"
            @click="handleBreakUp"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
