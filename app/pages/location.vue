<script setup>
import { useLocationManager } from 'vue-tg'
import DistanceBetweenPair from '../components/map/DistanceBetweenPair.vue'

import LastUpdatePair from '../components/map/LastUpdatePair.vue'

definePageMeta({
  pageTransition: false,
})

const locationManager = useLocationManager()

const pairStore = usePairStore()
const points = [
  { lat: 59.867290, lng: 30.307911, name: 'Санкт-Петербург', color: '#e74c3c' },
  { lat: 59.2205, lng: 39.8915, name: 'Вологда', color: '#3498db' },
]
onMounted(async () => {
  try {
    await locationManager.init()
  }
  catch {
    error.value = 'Не удалось инициализировать службы геолокации'
  }
})

const location = ref(null)
const error = ref(null)

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
</script>

<template>
  <div class="space-y-2.5">
    <!-- <DevelopmentPage>
      <div class="flex flex-col items-center justify-center min-h-[300px] p-6 bg-elevated/50 rounded-xl shadow-lg gap-4">
        <UIcon name="i-heroicons-map-pin" class="text-4xl text-primary" />
        <h2 class="text-xl font-bold">
          Доступ к геолокации
        </h2>
        <p class="text-center text-gray-500 max-w-xs">
          Для работы приложения необходимо разрешить доступ к вашей геопозиции.
        </p>
        <p class="text-xs text-gray-400 mt-2 text-center">
          Мы не передаём ваши данные третьим лицам
        </p>
      </div>
    </DevelopmentPage> -->

    <DistanceBetweenPair
      :user1-avatar="pairStore.user1.avatar"
      :user2-avatar="pairStore.user2.avatar"
      :distance="402"
      class="animate-fade-in "
    />

    <LastUpdatePair
      class="animate-initial animate-slide-up delay-100 "
      :user1="pairStore.user1"
      :user2="pairStore.user2"
    />

    <h2 v-if="pairStore.locations.length" class=" font-bold text-primary text-center animate-fade-in translate-y-3 break-all">
      {{ pairStore.locations }}
    </h2>

    <!-- <RouteMap
      :points="points"
      route-color="var(--ui-color-primary-500)"
    /> -->
  </div>
</template>
