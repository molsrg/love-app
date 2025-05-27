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
      title: 'Пара',
      icon: 'i-heroicons-users',
    },
    privacy: {
      title: 'Конфиденциальность',
      icon: 'i-heroicons-shield-check',
    },
  },
}

const notifications = ref(false)
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
const themePopover = ref(false)

function changeTheme(theme: typeof themes[0]) {
  if (!appConfig?.ui?.colors)
    return
  currentTheme.value = theme.value
  appConfig.ui.colors.primary = theme.value
  themePopover.value = !themePopover.value
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
          <UIcon :name="config.sections.profile.icon" class="text-primary size-6" />
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
          <label class="text-sm text-gray-400 mb-1 block">Аватар</label>

          <!-- <UAvatar size="3xl" src="https://github.com/benjamincanac.png" alt="Benjamin Canac" /> -->
          <UButton
            class="w-full h-[36px] flex items-center "
            :avatar="{
              src: 'https://github.com/benjamincanac.png',
            }"
            size="md"
            color="neutral"
            variant="subtle"
          >
            Изменить
          </UButton>
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Тема</label>

          <UPopover v-model:open="themePopover" arrow>
            <UButton class="w-full h-[36px]" icon="i-lucide-palette" color="neutral" variant="subtle">
              {{ themes.find(t => t.value === currentTheme)?.name || 'Выбрать тему' }}
            </UButton>

            <template #content>
              <div class="p-2">
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    v-for="theme in themes"
                    :key="theme.value"
                    color="neutral"
                    variant="subtle"
                    class="text-center"
                    :class="{ 'ring-1 ring-primary': currentTheme === theme.value }"
                    :label="theme.name"
                    @click="changeTheme(theme)"
                  >
                    <template #leading>
                      <UChip :color="theme.value" size="sm" />
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
          <UIcon :name="config.sections.notifications.icon" class="text-primary size-6" />
          <h2 class="text-lg font-semibold text-white">
            {{ config.sections.notifications.title }}
          </h2>
        </div>
      </template>

      <div class="space-y-4">
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
          <UPopover arrow>
            <UButton class="w-full h-[36px]" :ui="{ trailingIcon: 'ml-auto' }" disabled color="neutral" variant="subtle" icon="i-lucide-calendar" trailing-icon="i-material-symbols-lock-outline">
              {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Select a date' }}
            </UButton>

            <template #content>
              <UCalendar v-model="modelValue" class="p-2 w-full" />
            </template>
          </UPopover>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white">
              Передать права хоста
            </h3>
            <p class="text-sm text-gray-400">
              Хост может менять дату начала отношений
            </p>
          </div>

          <UCheckbox v-model="notifications" />
        </div>

        <div class="flex justify-center">
          <UButton
            v-model="profile.partnerName"
            leading-icon="i-material-symbols:heart-broken-outline" class=" h-[36px]" color="error" variant="subtle" label="Разорвать пару"
            size="lg"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
