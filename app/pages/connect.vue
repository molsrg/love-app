<script setup lang="ts">
import { useLocationManager } from 'vue-tg'

interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
}

const locationManager = useLocationManager()
const location: Ref<LocationData | null> = ref(null)
const error: Ref<string | null> = ref(null)
const isLoading = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    // await locationManager.init()
    startAutoUpdate()
  }
  catch {
    error.value = 'Не удалось инициализировать службы геолокации'
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

function startAutoUpdate() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  intervalId = setInterval(requestGeolocation, 3000)
}

async function requestGeolocation() {
  error.value = null
  isLoading.value = true
  try {
    if (!locationManager.isInited) {
      await locationManager.init()
    }
    const loc = await locationManager.getLocation()
    if (loc) {
      location.value = {
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy ?? loc.horizontal_accuracy,
      }
    }
    else {
      error.value = 'Доступ к геопозиции не предоставлен'
    }
  }
  catch {
    error.value = 'Ошибка при получении геопозиции'
  }
  finally {
    isLoading.value = false
  }
}

function openSettings() {
  locationManager.openSettings()
}

const canRequest = computed(() => locationManager.isLocationAvailable && !isLoading.value)
const showGrantButton = computed(() => !locationManager.isAccessGranted)
const showSettingsButton = computed(() => locationManager.isAccessRequested && !locationManager.isAccessGranted)
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[300px] p-8 bg-elevated/50 rounded-2xl shadow-xl gap-6">
    <UIcon name="i-heroicons-map-pin" class="text-5xl text-primary mb-2" />
    <h2 class="text-2xl font-bold mb-1">
      Доступ к геолокации
    </h2>
    {{ locationManager }}
    <p class="text-center text-gray-500 max-w-md mb-2">
      Для работы приложения необходимо разрешить доступ к вашей геопозиции.
    </p>
    <UButton
      v-if="showGrantButton"
      color="primary"
      size="lg"
      :label="isLoading ? 'Запрос...' : 'Разрешить доступ'"
      :disabled="!canRequest"
      class="w-full max-w-xs"
      @click="requestGeolocation"
    />
    <UButton
      v-if="showSettingsButton"
      color="gray"
      size="md"
      label="Открыть настройки"
      class="w-full max-w-xs"
      @click="openSettings"
    />
    <div v-if="locationManager.isAccessGranted && location" class="mt-4 text-center w-full">
      <div class="text-base font-medium">
        Широта: <span class="font-mono">{{ location.latitude }}</span>
      </div>
      <div class="text-base font-medium">
        Долгота: <span class="font-mono">{{ location.longitude }}</span>
      </div>
      <div v-if="location.accuracy" class="text-sm text-gray-400">
        Точность: {{ location.accuracy }} м
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-2 text-center">
      {{ error }}
    </p>
    <p class="text-xs text-gray-400 mt-2 text-center">
      Мы не передаём ваши данные третьим лицам
    </p>
  </div>
</template>
