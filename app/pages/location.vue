<script setup>
import { useLocationManager } from 'vue-tg'
import RouteMap from '../components/map/RouteMap.vue'

import UserDistance from '../components/map/UserDistance.vue'

definePageMeta({
  pageTransition: false,
})
const { t } = useI18n()
const pairStore = usePairStore()
const routePoints = ref([
  {
    lat: 59.867290,
    lng: 30.307911,
    name: 'Санкт-Петербург',
  },
  {
    lat: 59.2205,
    lng: 39.8915,
    name: 'Вологда',
  },
])

const locationManager = useLocationManager()

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
  <div class="space-y-3">
    <DevelopmentPage>
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
    </DevelopmentPage>
    <UserDistance
      :user1-avatar="pairStore.user1.avatar"
      :user2-avatar="pairStore.user2.avatar"
      :distance="402"
      class="animate-initial animate-slide-up"
    />

    <div class="flex flex-col gap-3 p-4 bg-elevated/50 rounded-lg animate-initial animate-slide-up">
      <div class="flex items-center gap-3">
        <UChip inset :color="pairStore.user1.isOnline ? 'success' : 'error'">
          <UAvatar :src="pairStore.user1.avatar" size="xl" />
        </UChip>
        <div class="flex-1">
          <USeparator
            type="dashed"
            size="sm"
            :color="pairStore.user1.isOnline ? 'success' : 'error'"
          />
        </div>
        <UBadge :color="pairStore.user1.isOnline ? 'success' : 'error'" variant="subtle" :label="pairStore.user1.isOnline ? 'онлайн' : '2 недели назад'" />
      </div>
      <div class="flex items-center gap-3">
        <UChip inset :color="pairStore.user2.isOnline ? 'success' : 'false'">
          <UAvatar :src="pairStore.user2.avatar" size="xl" />
        </UChip>
        <div class="flex-1">
          <USeparator
            type="dashed"
            size="sm"

            :color="pairStore.user2.isOnline ? 'success' : 'error'"
          />
        </div>
        <UBadge :color="pairStore.user2.isOnline ? 'success' : 'error'" variant="subtle" :label="pairStore.user2.isOnline ? 'онлайн' : 'оффлайн'" />
      </div>
    </div>

    <!-- <RouteMap :points="routePoints" /> -->
  </div>
</template>
