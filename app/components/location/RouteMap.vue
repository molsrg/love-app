<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Point {
  lat: number
  lng: number
  name?: string
  color?: string
}

const props = defineProps<{
  points: Point[]
  routeColor?: string
}>()

const tabs = [
  { label: 'Пеший', value: 'foot-walking', icon: 'i-lucide-footprints' },
  { label: 'На машине', value: 'driving-car', icon: 'i-lucide-car' },
]

const activeProfile = ref('foot-walking')

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function initMap() {
  if (!mapContainer.value)
    return

  map.value = L.map(mapContainer.value).setView([59.94, 30.31], 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
    map.value,
  )
}

function createCustomIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle fill="white" cx="12" cy="9" r="3"/>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

async function fetchRoute() {
  if (!props.points || props.points.length !== 2)
    return

  loading.value = true
  error.value = null

  try {
    const [start, end] = props.points
    if (!start || !end)
      throw new Error('Неверные координаты')

    const data = await $fetch('/api/route', {
      params: {
        start: `${start.lng},${start.lat}`,
        end: `${end.lng},${end.lat}`,
        profile: activeProfile.value,
      },
    })

    if (!data.features || data.features.length === 0) {
      throw new Error('Маршрут не найден')
    }

    const route = data.features[0]

    map.value?.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.GeoJSON || layer instanceof L.Marker) {
        map.value?.removeLayer(layer)
      }
    })

    props.points.forEach((point, index) => {
      const markerColor = point.color || (index === 0 ? '#e74c3c' : '#3498db')
      const title = index === 0 ? 'Ты' : 'Партнёр'
      L.marker([point.lat, point.lng], {
        icon: createCustomIcon(markerColor),
      })
        .bindPopup(
          `
  <div>
    <div style="font-weight:bold; font-size:14px; margin-bottom:2px;">${title}</div>
    Широта: ${point.lat.toFixed(5)}<br>
    Долгота: ${point.lng.toFixed(5)}
  </div>
`,
        )
        .addTo(map.value!)
    })

    L.geoJSON(route, {
      style: {
        color: props.routeColor || '#9b59b6',
        weight: 5,
        opacity: 0.8,
      },
    }).addTo(map.value!)

    const routeLayer = L.geoJSON(route)
    map.value?.fitBounds(routeLayer.getBounds().pad(0.2))
  }
  catch (err) {
    console.error('Ошибка построения маршрута:', err)
    error.value = `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  initMap()
  fetchRoute()
})

watch(() => [props.points, props.routeColor], fetchRoute, { deep: true })
watch(activeProfile, fetchRoute)
</script>

<template>
  <div class="flex flex-col gap-2">
    <UTabs v-model="activeProfile" :content="false" size="md" :items="tabs" />

    <div class="relative w-full h-[500px] rounded-lg overflow-hidden shadow-sm">
      <div ref="mapContainer" class="w-full h-full z-0" />

      <div
        v-if="loading"
        class="absolute inset-0 z-20 flex items-center justify-center bg-white/70"
      >
        <div class="flex flex-col items-center gap-2">
          <span
            class="loader border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin"
          />
          <span class="text-sm text-gray-500">Загрузка карты...</span>
        </div>
      </div>

      <UAlert
        v-if="error"
        color="rose"
        variant="soft"
        class="absolute top-4 left-1/2 -translate-x-1/2 z-[10]"
      >
        {{ error }}
      </UAlert>
    </div>
  </div>
</template>

<style scoped>
.custom-marker {
  @apply bg-transparent border-none;
}

.loader {
  border-top-color: transparent;
}

:deep(.leaflet-container) {
  @apply z-0;
}

:deep(.leaflet-control-container) {
  @apply z-[10];
}

:deep(.leaflet-popup) {
  @apply z-[10];
}
</style>
