<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Point {
  lat: number
  lng: number
  name: string
  color?: string
}

interface RouteInfo {
  startName: string
  endName: string
  distance: string
  duration: number
}

const props = defineProps<{
  points: Point[]
  routeColor?: string
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const routeInfo = ref<RouteInfo | null>(null)
const config = useRuntimeConfig()
// Инициализация карты
function initMap() {
  if (!mapContainer.value)
    return

  map.value = L.map(mapContainer.value).setView([59.94, 30.31], 10)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map.value)
}

// Кастомные иконки для маркеров
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

// Получение маршрута (пеший)
async function fetchRoute() {
  if (!props.points || props.points.length !== 2)
    return

  loading.value = true
  error.value = null

  try {
    const [start, end] = props.points
    if (!start || !end)
      throw new Error('Неверные координаты')

    // Пеший маршрут
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${config.public.leafletApiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      throw new Error('Маршрут не найден')
    }

    const route = data.features[0]
    const distance = (route.properties.segments[0].distance / 1000).toFixed(1)
    const duration = Math.round(route.properties.segments[0].duration / 60)

    // Очищаем предыдущий маршрут
    map.value?.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.GeoJSON || layer instanceof L.Marker) {
        map.value?.removeLayer(layer)
      }
    })

    // Добавляем маркеры
    props.points.forEach((point, index) => {
      const markerColor = point.color || (index === 0 ? '#e74c3c' : '#3498db')
      L.marker([point.lat, point.lng], {
        icon: createCustomIcon(markerColor),
      })
        .bindPopup(`<b>${point.name}</b><br>Широта: ${point.lat.toFixed(5)}<br>Долгота: ${point.lng.toFixed(5)}`)
        .addTo(map.value!)
    })

    // Добавляем маршрут
    L.geoJSON(route, {
      style: {
        color: props.routeColor || '#9b59b6',
        weight: 5,
        opacity: 0.8,
      },
    }).addTo(map.value!)

    // Обновляем информацию
    routeInfo.value = {
      startName: start.name,
      endName: end.name,
      distance,
      duration,
    }

    // Масштабируем карту
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

// Следим за изменением точек и цвета маршрута
watch(() => [props.points, props.routeColor], fetchRoute, { deep: true })
</script>

<template>
  <div class="relative w-full h-[500px] rounded-lg overflow-hidden shadow-sm">
    <div ref="mapContainer" class="w-full h-full z-0" />

    <div v-if="loading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
      <div class="flex flex-col items-center gap-2">
        <span class="loader border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin" />
        <span class="text-sm text-gray-500">Загрузка карты...</span>
      </div>
    </div>

    <!-- <UCard v-if="routeInfo" class="absolute bottom-4 left-4 z-[10] max-w-sm">
      <template #header>
        <h3 class="text-base font-semibold">
          Информация о маршруте
        </h3>
      </template>

      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-primary" />
          <span class="text-sm">{{ routeInfo.startName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-primary" />
          <span class="text-sm">{{ routeInfo.endName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-primary" />
          <span class="text-sm">{{ routeInfo.distance }} км</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary" />
          <span class="text-sm">~{{ routeInfo.duration }} мин</span>
        </div>
      </div>
    </UCard> -->

    <UAlert
      v-if="error"
      color="rose"
      variant="soft"
      class="absolute top-4 left-1/2 -translate-x-1/2 z-[10]"
    >
      {{ error }}
    </UAlert>
  </div>
</template>

<style scoped>
.custom-marker {
  @apply bg-transparent border-none;
}

.loader {
  border-top-color: transparent;
}

/* Управление z-index для карты и её элементов */
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
