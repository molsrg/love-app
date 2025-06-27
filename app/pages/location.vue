<script setup>
import { useLocationManager } from 'vue-tg'
import DistanceBetweenPair from '../components/map/DistanceBetweenPair.vue'

import LastUpdatePair from '../components/map/LastUpdatePair.vue'

// definePageMeta({
//   pageTransition: false,
// })

const locationManager = useLocationManager()

const pairStore = usePairStore()
const points = [
  { lat: 59.867290, lng: 30.307911, name: 'Санкт-Петербург', color: '#e74c3c' },
  { lat: 59.2205, lng: 39.8915, name: 'Вологда', color: '#3498db' },
]
// onMounted(async () => {
//   try {
//     await locationManager.init()
//   }
//   catch {
//     error.value = 'Не удалось инициализировать службы геолокации'
//   }
// })

const location = ref(null)
const error = ref(null)
const { $accessGranted, $isLocationAvailable } = useNuxtApp()
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
        <UButton

          trailing-icon="i-material-symbols-light-globe-location-pin-sharp"
          color="primary"
          variant="subtle"
          size="xl"

          label="Разрешить сбор геопозиции в настройках"
          @click="locationManager.openSettings()"
        />
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

    <UCard v-if="!$accessGranted && $isLocationAvailable" variant="soft" class="animate-initial animate-slide-up delay-200">
      <template #header>
        <div class="flex flex-col">
          <UBadge
            size="xl"
            trailing-icon="i-material-symbols-light-globe-location-pin-sharp"
            color="error"
            variant="subtle"
            class=" mx-auto "
            label="Нет доступа к геопозиции"
          />
        </div>
      </template>
      <div class="flex flex-col items-center gap-3 w-full">
        <div class="text-gray-400 text-justify text-base">
          Для корректной работы приложения, вам нужно разрешить доступ в настройках
        </div>
        <img src="../assets/img/geo_access.jpg" alt="Инструкция по разрешению геолокации" class="rounded-lg w-full ">

        <UButton
          v-if="!$accessGranted"
          class="mt-2 mx-auto"
          trailing-icon="i-heroicons-cog-6-tooth"
          color="primary"
          variant="subtle"
          size="md"
          label="Открыть настройки"
          @click="locationManager.openSettings()"
        />
      </div>
    </UCard>
    <h2 v-if="pairStore.locations.length" class=" font-bold text-primary text-center animate-fade-in translate-y-3 break-all">
      {{ pairStore.locations }}
    </h2>
    <!-- <RouteMap
      :points="points"
      route-color="var(--ui-color-primary-500)"
    /> -->
  </div>
</template>
