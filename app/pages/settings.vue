<script lang="ts" setup>
import type { DateValue } from '@internationalized/date'
import type { Profile, Theme } from '~/types/settings'
import { CalendarDate, parseDate } from '@internationalized/date'

import { useCloudStorage } from 'vue-tg/latest'
import { SETTINGS_SECTIONS, THEMES } from '~/config/settings'

const { t } = useI18n()
const { telegramSelectionChanged, telegramNotificationOccurred } = useHapticFeedback()
const appConfig = useAppConfig()
const toast = useToast()
const api = useApi()
const pairStore = usePairStore()

const initialName = ref(pairStore.user1.username ?? '')
const userName = ref(pairStore.user1.username ?? '')
const activeTheme = ref(appConfig.ui.colors.primary)

const userProfile = computed<Profile>(() => ({
  name: userName.value,
  partnerName: pairStore.user2.username ?? '',
  startDate: new Date(pairStore.startDate).toLocaleDateString('en-CA'),
  theme: activeTheme.value,
  ...(pairStore.user1.avatar ? { avatar: pairStore.user1.avatar } : {}),
}))

// Theme app

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
  THEMES.find((theme: Theme) => theme.value === activeTheme.value)?.name || 'settings.profile.selectTheme',
)

// Start date
const isCalendarPopoverOpen = ref(false)
const selectedDate = ref<any>(parseDate(userProfile.value.startDate))

const isHostTransferEnabled = ref(false)
const canEditPair = computed(() => pairStore.isHost)

function handleHostTransfer() {
  if (isHostTransferEnabled.value) {
    if (confirm(t('settings.partner.confirmations.transferHost'))) {
      api.post('/pair/change-host', {})
        .then(() => {
          // Success
        })
        .catch((error) => {
          console.error('Failed to change host:', error)
        })
    }
    else {
      isHostTransferEnabled.value = false
    }
  }
}

watch(isHostTransferEnabled, (newValue) => {
  telegramSelectionChanged()
  if (newValue) {
    handleHostTransfer()
  }
})

function handleAvatarClick() {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  input?.click()
}

async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      usePairStore().stopPairPolling()
      await api.postFormData('/user/change-avatar', formData)
      usePairStore().startPairPolling()
      toast.add({
        title: t('settings.profile.avatarUpdated.title'),
        description: t('settings.profile.avatarUpdated.description'),
        color: 'success',
      })

      telegramNotificationOccurred('success')
    }
    catch (error) {
      console.error('Failed to upload avatar:', error)
      usePairStore().startPairPolling()
      toast.add({
        title: t('settings.profile.avatarError.title'),
        description: t('settings.profile.avatarError.description'),
        color: 'error',
      })
    }
    finally {
      target.value = ''
    }
  }
}

function handleBreakUp() {
  telegramSelectionChanged()
  if (confirm(t('settings.partner.confirmations.breakup'))) {
    api.delete('/pair')
      .then(() => {
        useTgWebAppStore().userInPair = false
        usePairStore().stopPairPolling()
        navigateTo('/connect')
      })
      .catch((error) => {
        console.error('Failed to break up the pair:', error)
      })
  }
}

async function handleDateChange(date: any) {
  if (!date || !('year' in date))
    return

  selectedDate.value = date
  userProfile.value.startDate = date.toString()
  telegramSelectionChanged()
  isCalendarPopoverOpen.value = false

  try {
    usePairStore().stopPairPolling()
    await api.post('/pair/change-date', { date: date.toString() })
    usePairStore().startPairPolling()
  }
  catch (error) {
    console.error('Error connecting pair:', error)
  }
}

const isOpenChangeName = ref(false)
const newUserName = ref('')
const nameError = ref('')

// Add watch for drawer state to reset values
watch(isOpenChangeName, (isOpen) => {
  if (!isOpen) {
    newUserName.value = ''
    nameError.value = ''
  }
})

function validateName(name: string): boolean {
  if (!name) {
    nameError.value = t('settings.profile.errors.empty')
    return false
  }
  if (name.length < 2) {
    nameError.value = t('settings.profile.errors.tooShort')
    return false
  }
  if (name.length > 30) {
    nameError.value = t('settings.profile.errors.tooLong')
    return false
  }
  if (name === userName.value) {
    nameError.value = t('settings.profile.errors.sameName')
    return false
  }
  nameError.value = ''
  return true
}

// Add watch for real-time validation
watch(newUserName, (newValue) => {
  validateName(newValue)
})

async function handleNameChange() {
  if (!validateName(newUserName.value))
    return

  try {
    usePairStore().stopPairPolling()
    await api.post('/user/change-name', { username: newUserName.value })

    // Update name in pairStore and local ref
    pairStore.user1.username = newUserName.value
    userName.value = newUserName.value
    initialName.value = newUserName.value

    telegramNotificationOccurred('success')
    toast.add({
      title: t('settings.profile.nameUpdated.title'),
      description: t('settings.profile.nameUpdated.description'),
      color: 'success',
    })
    isOpenChangeName.value = false
  }
  catch (error) {
    console.error('Failed to update name:', error)
    toast.add({
      title: t('settings.profile.nameError.title'),
      description: t('settings.profile.nameError.description'),
      color: 'error',
    })
  }
  finally {
    usePairStore().startPairPolling()
  }
}

const { currentLocale, setLanguage, languages } = useLanguage()

function isDateDisabled(date: DateValue) {
  if (!('year' in date))
    return false
  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  )
  return date.compare(today) > 0
}
</script>

<template>
  <div class="space-y-3">
    <h1 class="text-2xl font-bold text-white animate-fade-in mb-[-8px]">
      {{ t('settings.title') }}
    </h1>
    <UCard class="animate-slide-up opacity-0 translate-y-5" style="animation-delay: 0.2s" variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="SETTINGS_SECTIONS.profile.icon" class="text-primary size-6" />
          <h2 class="text-lg font-semibold text-white">
            {{ t(SETTINGS_SECTIONS.profile.title) }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <div class="flex gap-2 items-center mb-1">
            <label class="text-sm text-gray-400  block">{{ t('settings.profile.name') }}</label>
            <UButton :label="t('settings.profile.change')" color="primary" size="xs" variant="outline" @click="isOpenChangeName = !isOpenChangeName " />
          </div>

          <UInput
            v-model="userName"
            disabled

            :placeholder="t('settings.profile.namePlaceholder')"
            class="w-full"
            size="lg"
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.profile.avatar') }}</label>
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
            {{ t('settings.profile.changeAvatar') }}
          </UButton>
          <input
            accept="image/*"
            class="hidden"
            type="file"
            @change="handleAvatarChange"
          >
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.profile.theme') }}</label>

          <UPopover v-model:open="isThemePopoverOpen" arrow>
            <UButton class="w-full h-[36px]" color="neutral" icon="i-lucide-palette" variant="subtle">
              {{ t(activeThemeName) }}
            </UButton>

            <template #content>
              <div class="p-2">
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    v-for="theme in THEMES"
                    :key="theme.value"
                    :class="{ 'ring-1 ring-primary': activeTheme === theme.value }"
                    :label="t(theme.name)"
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
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.profile.language') }}</label>

          <USelect
            v-model="currentLocale"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
            }"
            icon="i-famicons-language"
            variant="subtle"
            :content="{
              align: 'center',
              side: 'bottom',
              sideOffset: 2,
            }"
            arrow
            :items="languages"
            class="w-full"
            @update:model-value="setLanguage"
          />
        </div>
      </div>
    </UCard>
    <UCard class="animate-slide-up opacity-0 translate-y-5" style="animation-delay: 0.4s" variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="SETTINGS_SECTIONS.pair.icon" class="text-primary size-6" />
          <h2 class="text-lg font-semibold text-white">
            {{ t(SETTINGS_SECTIONS.pair.title) }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.partner.name') }}</label>
          <UInput
            v-model="userProfile.partnerName"
            variant="subtle"
            :placeholder="t('settings.partner.namePlaceholder')"
            class="w-full"
            disabled
            size="lg"
            trailing-icon="i-material-symbols-lock-outline"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.partner.startDate') }}</label>
          <UPopover v-model:open="isCalendarPopoverOpen" arrow>
            <UButton
              :disabled="!canEditPair"
              :trailing-icon="!canEditPair ? 'i-material-symbols-lock-outline' : ''"
              :ui="{ trailingIcon: 'ml-auto' }"
              class="w-full h-[36px]"
              color="neutral"
              icon="i-lucide-calendar"
              variant="subtle"
            >
              {{ userProfile.startDate }}
            </UButton>

            <template #content>
              <UCalendar
                v-model="selectedDate"
                :is-date-disabled="isDateDisabled"
                :ui="{
                  cellTrigger: ' data-today:not-data-[selected]:text-[var(--ui-deafult)]',
                }"
                class="p-2 w-full"
                @update:model-value="handleDateChange"
              />
            </template>
          </UPopover>
        </div>

        <div v-if="canEditPair" class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              {{ t('settings.partner.transferHost') }}
            </h3>
            <p class="text-sm text-gray-400">
              {{ t('settings.partner.hostDescription') }}
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
            :label="t('settings.partner.breakUp')"
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
    <UDrawer v-model:open="isOpenChangeName">
      <template #content>
        <div class=" space-y-3 ">
          <div>
            <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.profile.oldName') }}</label>
            <UInput
              v-model="userName"
              disabled
              :placeholder="t('settings.profile.namePlaceholder')"
              class="w-full"
              size="lg"
            />
          </div>
          <div>
            <label class="text-sm text-gray-400 mb-1 block">{{ t('settings.profile.newName') }}</label>
            <UInput
              v-model="newUserName"
              :placeholder="t('settings.profile.namePlaceholder')"
              class="w-full"
              size="lg"
            />
            <UBadge v-if="nameError" class="mt-1 ml-1" color="error" :label="nameError" variant="outline" />
          </div>
          <div class="flex justify-end">
            <UButton
              :disabled="!!nameError"
              :label="t('settings.profile.saveNewName')"
              color="primary"
              variant="subtle"
              @click="handleNameChange"
            />
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
