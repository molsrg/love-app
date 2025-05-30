<script lang="ts" setup>
import type { CalendarDate, DateValue } from '@internationalized/date'
import type { Profile, Theme } from '~/types/settings'
import { parseDate } from '@internationalized/date'
import { useCloudStorage } from 'vue-tg/latest'
import { SETTINGS_SECTIONS, THEMES } from '~/config/settings'

const { telegramSelectionChanged, telegramNotificationOccurred } = useHapticFeedback()
const appConfig = useAppConfig()
const toast = useToast()

const userProfile = ref<Profile>({
  name: 'Пользователь 1',
  partnerName: 'Пользователь 2',
  avatar: 'https://github.com/benjamincanac.png',
  startDate: '2025-05-05',
  theme: 'dark',
})

const activeTheme = ref(appConfig.ui.colors.primary)
const isThemePopoverOpen = ref(false)

async function changeTheme(theme: Theme): Promise<void> {
  if (!appConfig?.ui?.colors)
    return

  await useCloudStorage().setItem('theme', theme.value)
  activeTheme.value = theme.value
  telegramSelectionChanged()
  appConfig.ui.colors.primary = theme.value
  isThemePopoverOpen.value = !isThemePopoverOpen.value
}

const activeThemeName = computed(() =>
  THEMES.find((theme: Theme) => theme.value === activeTheme.value)?.name || 'Выбрать тему',
)

const isCalendarPopoverOpen = ref(false)
const selectedDate = ref<DateValue | null>(parseDate(userProfile.value.startDate))

const isHostTransferEnabled = ref(false)

function handleHostTransfer() {
  if (isHostTransferEnabled.value) {
    if (confirm('Вы уверены, что хотите передать права партнёру?')) {
    console.log('Host trasfered')
    isHostTransferEnabled.value = true
  }
    // TODO: Здесь будет логика разрыва пары
  }
  else {
    isHostTransferEnabled.value = false
  }
  }
}

watch(isHostTransferEnabled, (newValue) => {
  if (newValue) {
    telegramSelectionChanged()
    handleHostTransfer()
  }
})

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

function handleBreakUp() {
  telegramSelectionChanged()
  if (confirm('Вы уверены, что хотите разорвать пару?')) {
    console.log('Breaking up the pair')
    // TODO: Здесь будет логика разрыва пары
  }
}

function handleDateChange(date: CalendarDate) {
  if (!date || typeof date !== 'object' || 'start' in date || Array.isArray(date))
    return
  selectedDate.value = date
  userProfile.value.startDate = date.toString()
  telegramSelectionChanged()
  isCalendarPopoverOpen.value = false

  console.log('new date - ', date );
  
}

const debouncedUpdateName = useDebounce((name: string) => {
  updateNameOnBackend(name)
}, 600)

function updateNameOnBackend(newName: string) {
  telegramNotificationOccurred('success')
  toast.add({
    title: `Имя обновлено! ${newName}`,
    description: 'Ваше имя успешно изменено.',
    color: 'success',
  })
}

watch(() => userProfile.value.name, (newName, oldName) => {
  if (newName !== oldName) {
    debouncedUpdateName(newName)
  }
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold text-white animate-fade-in mb-0">
      {{ $t('settings.title') }}
    </h1>
    <UCard class="animate-slide-up opacity-0 translate-y-5" style="animation-delay: 0.2s" variant="subtle">
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
            :placeholder="$t('settings.profile.namePlaceholder')"
            class="w-full"
            size="lg"
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.profile.avatar') }}</label>
          <UButton
            :avatar="{
              src: userProfile.avatar,
            }"
            class="w-full h-[36px] flex items-center"
            color="neutral"
            size="md"
            variant="subtle"
            @click="handleAvatarClick"
          >
            {{ $t('settings.profile.changeAvatar') }}
          </UButton>
          <input
            accept="image/*"
            class="hidden"
            type="file"
            @change="handleAvatarChange"
          >
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.profile.theme') }}</label>

          <UPopover v-model:open="isThemePopoverOpen" arrow>
            <UButton class="w-full h-[36px]" color="neutral" icon="i-lucide-palette" variant="subtle">
              {{ activeThemeName }}
            </UButton>

            <template #content>
              <div class="p-2">
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    v-for="theme in THEMES"
                    :key="theme.value"
                    :class="{ 'ring-1 ring-primary': activeTheme === theme.value }"
                    :label="theme.name"
                    class="text-center"
                    color="neutral"
                    variant="subtle"
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
    <UCard class="animate-slide-up opacity-0 translate-y-5" style="animation-delay: 0.4s" variant="subtle">
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
            :placeholder="$t('settings.partner.namePlaceholder')"
            class="w-full"
            disabled
            size="lg"
            trailing-icon="i-material-symbols-lock-outline"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ $t('settings.partner.startDate') }}</label>
          <UPopover v-model:open="isCalendarPopoverOpen" arrow>
            <UButton
              :disabled="isHostTransferEnabled"
              :trailing-icon="isHostTransferEnabled ? 'i-material-symbols-lock-outline' : ''"
              :ui="{ trailingIcon: 'ml-auto' }"
              class="w-full h-[36px]" color="neutral" icon="i-lucide-calendar"
              variant="subtle"
            >
              {{ userProfile.startDate }}
            </UButton>

            <template #content>
              <UCalendar
                v-model="selectedDate" :ui="{

                  cellTrigger: ' data-today:not-data-[selected]:text-[var(--ui-deafult)]',
                }" class="p-2 w-full" @update:model-value="handleDateChange"
              />
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

          <UCheckbox
            v-model="isHostTransferEnabled"
            class="mr-1"
            size="lg"
          />
        </div>

        <div class="flex justify-center">
          <UButton
            :label="$t('settings.partner.breakUp')"
            class="h-[36px]"
            color="error"
            leading-icon="i-material-symbols:heart-broken-outline"
            size="lg"
            variant="subtle"
            @click="handleBreakUp"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
