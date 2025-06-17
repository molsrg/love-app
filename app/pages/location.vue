<script setup>
import { ref } from 'vue'
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
</script>

<template>
  <div class="space-y-3">
    <!-- <DevelopmentPage>
      <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-primary animate-bounce" />
      <UBadge
        :label="t('development.title')"
        color="primary"
        variant="solid"
        size="lg"
      />

      <UBadge
        :label="t('development.subtitle')"
        color="neutral"
        variant="subtle"
        size="lg"
      />
    </DevelopmentPage> -->
    <UserDistance
      :user1-avatar="pairStore.user1.avatar"
      :user2-avatar="pairStore.user2.avatar"
      :distance="402"
      class="animate-initial animate-slide-up"
    />
    <RouteMap :points="routePoints" />
  </div>
</template>
