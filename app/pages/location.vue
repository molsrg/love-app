<script setup>
import { useLocationManager } from 'vue-tg'

const locationManager = useLocationManager()
const { $accessGranted, $isLocationAvailable } = useNuxtApp()
const pairStore = usePairStore()
const { t } = useI18n()
// const points = [
//   { lat: 59.867290, lng: 30.307911, name: 'Санкт-Петербург', color: '#e74c3c' },
//   { lat: 59.2205, lng: 39.8915, name: 'Вологда', color: '#3498db' },
// ]

onMounted(async () => {
  if ($accessGranted.value && $isLocationAvailable.value) {
    await usePairStore().updateLocation()
  }
})
</script>

<template>
  <div class="space-y-2.5">
    <DistanceBetweenPair
      :user1-avatar="pairStore.user1.avatar"
      :user2-avatar="pairStore.user2.avatar"
      :distance="111121"
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
            :label="t('geo.noAccessTitle')"
          />
        </div>
      </template>
      <div class="flex flex-col items-center gap-3 w-full">
        <div class="text-gray-400 text-center text-base">
          {{ t('geo.noAccessText') }}
        </div>
        <img src="../assets/img/geo_access.jpg" alt="Инструкция по разрешению геолокации" class="rounded-lg w-full ">
        <p class="text-gray-400 text-center text-base">
          {{ t('geo.noAccessNote') }}
        </p>
        <UButton
          v-if="!$accessGranted"
          class="mt-2 mx-auto"
          trailing-icon="i-heroicons-cog-6-tooth"
          color="warning"
          variant="subtle"
          size="md"
          :label="t('geo.openSettings')"
          @click="locationManager.openSettings()"
        />
      </div>
    </UCard>

    <UCard v-if="!$isLocationAvailable" variant="soft" class="animate-initial animate-slide-up delay-200">
      <div class="flex flex-col items-center justify-center gap-2 p-2">
        <UIcon name="i-svg-spinners-blocks-shuffle-3" class="size-10" />
        <div class="text-center text-highlited animate-fade-in ">
          {{ t('geo.notAvailable') }}
        </div>
      </div>
    </UCard>

    <!-- <RouteMap
      :points="points"
      route-color="var(--ui-color-primary-500)"
    /> -->
  </div>
</template>
