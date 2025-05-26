<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const config = {
  sections: {
    profile: {
      title: 'Профиль',
      icon: 'i-heroicons-user-circle',
    },
    appearance: {
      title: 'Внешний вид',
      icon: 'i-heroicons-paint-brush',
    },
    notifications: {
      title: 'Уведомления',
      icon: 'i-heroicons-bell',
    },
    privacy: {
      title: 'Конфиденциальность',
      icon: 'i-heroicons-shield-check',
    },
  },
}

const notifications = ref(true)
const locationSharing = ref(false)
const showOnlineStatus = ref(true)

const profile = ref({
  name: 'Пользователь 1',
  partnerName: 'Пользователь 2',
  startDate: '2025-05-05',
  theme: 'dark',
})

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))

// Управление темой
const themes = [
  { name: 'Розовый', value: 'rose' },
  { name: 'Зелёный', value: 'emerald' },
  { name: 'Голубой', value: 'blue' },
  { name: 'Жёлтый', value: 'amber' },
  { name: 'Индиго', value: 'indigo' },
]

const appConfig = useAppConfig()
const currentTheme = ref(appConfig.ui.colors.primary)

function changeTheme(theme: typeof themes[0]) {
  if (!appConfig?.ui?.colors)
    return
  currentTheme.value = theme.value
  appConfig.ui.colors.primary = theme.value
}
</script>

<template>
  <div class="p-4 mx-auto space-y-6 ">
    <h1 class="text-2xl font-bold text-white">
      Настройки
    </h1>
    <UCard variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="config.sections.profile.icon" class="text-primary" />
          <h2 class="text-lg font-semibold text-white">
            {{ config.sections.profile.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Ваше имя</label>
          <UInput
            v-model="profile.name"
            size="lg"
            class="w-full"
            placeholder="Введите ваше имя"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Имя партнера</label>
          <UInput
            v-model="profile.partnerName"
            disabled
            size="lg"
            trailing-icon="i-material-symbols-lock-outline"
            class="w-full"
            placeholder="Введите имя партнера"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Дата начала отношений</label>
          <UPopover>
            <UButton class="w-full h-[36px]" :ui="{ trailingIcon: 'ml-auto' }" disabled color="neutral" variant="subtle" icon="i-lucide-calendar" trailing-icon="i-material-symbols-lock-outline">
              {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Select a date' }}
            </UButton>

            <template #content>
              <UCalendar v-model="modelValue" class="p-2 w-full" />
            </template>
          </UPopover>
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">Тема</label>
          <UPopover>
            <UButton class="w-full h-[36px]" icon="i-lucide-palette" color="neutral" variant="subtle">
              {{ themes.find(t => t.value === currentTheme)?.name || 'Выбрать тему' }}
            </UButton>

            <template #content>
              <div class="p-2">
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    v-for="theme in themes"
                    :key="theme.value"
                    :color="theme.value as 'rose' | 'success' | 'lime' | 'cyan' | 'indigo'"
                    variant="soft"
                    class="text-center"
                    :class="{ 'ring-1 ring-primary': currentTheme === theme.value }"
                    :label="theme.name"
                    @click="changeTheme(theme)"
                  />
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
          <UIcon :name="config.sections.notifications.icon" class="text-primary" />
          <h2 class="text-lg font-semibold text-white">
            {{ config.sections.notifications.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              Push-уведомления
            </h3>
            <p class="text-sm text-gray-400">
              Получать уведомления о новых событиях
            </p>
          </div>
          <USwitch v-model="notifications" />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              Напоминания о годовщине
            </h3>
            <p class="text-sm text-gray-400">
              Уведомления о приближающейся годовщине
            </p>
          </div>
          <USwitch v-model="notifications" />
        </div>
      </div>
    </UCard>

    <!-- Конфиденциальность -->
    <UCard variant="subtle">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon :name="config.sections.privacy.icon" class="text-primary" />
          <h2 class="text-lg font-semibold text-white">
            {{ config.sections.privacy.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              Показывать онлайн статус
            </h3>
            <p class="text-sm text-gray-400">
              Другие пользователи будут видеть, когда вы онлайн
            </p>
          </div>
          <USwitch v-model="showOnlineStatus" />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              Делиться местоположением
            </h3>
            <p class="text-sm text-gray-400">
              Разрешить доступ к вашему местоположению
            </p>
          </div>
          <USwitch v-model="locationSharing" />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
