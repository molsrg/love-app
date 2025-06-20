<script setup>
import { ref } from 'vue'
import { useLocationManager } from 'vue-tg'

const locationManager = useLocationManager()
const location = ref(null)
const error = ref(null)
onMounted(async () => {
  try {
    await locationManager.init()
  }
  catch (error) {
    error.value = 'Failed to initialize location services'
  }
})

async function requestGeolocation() {
  error.value = null
  try {
    if (!locationManager.isInited) {
      await locationManager.init()
    }
    const loc = await locationManager.getLocation()
    if (loc) {
      location.value = loc
    }
    else {
      error.value = 'Доступ к геопозиции не предоставлен'
    }
  }
  catch {
    error.value = 'Ошибка при получении геопозиции'
  }
}

function testSettings() {
  locationManager.openSettings()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[300px] p-6 bg-elevated/50 rounded-xl shadow-lg gap-4">
    <UIcon name="i-heroicons-map-pin" class="text-4xl text-primary" />
    <h2 class="text-xl font-bold">
      Доступ к геолокации
    </h2>
    <p class="text-center text-gray-500 max-w-xs">
      Для работы приложения необходимо разрешить доступ к вашей геопозиции.
    </p>
    <UButton
      color="primary"
      size="lg"
      label="Разрешить доступ"
      @click="requestGeolocation"
    />

    <UButton label="Настройки открыть" @click="testSettings" />
    <div v-if="location" class="mt-4 text-center">
      <div>Широта: {{ location.latitude }}</div>
      <div>Долгота: {{ location.longitude }}</div>
      <div v-if="location.accuracy">
        Точность: {{ location.accuracy }} м
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-400 mt-2 text-center">
      {{ error }}
    </p>
    <p class="text-xs text-gray-400 mt-2 text-center">
      Мы не передаём ваши данные третьим лицам
    </p>
  </div>
</template>
