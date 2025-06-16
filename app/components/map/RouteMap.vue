<template>
  <div class="route-map-container">
    <div ref="mapContainer" class="map-container"></div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>Построение маршрута...</p>
    </div>
    
    <div v-if="routeInfo" class="route-info">
      <h3>Информация о маршруте</h3>
      <p><strong>Откуда:</strong> {{ routeInfo.startName }}</p>
      <p><strong>Куда:</strong> {{ routeInfo.endName }}</p>
      <p><strong>Расстояние:</strong> {{ routeInfo.distance }} км</p>
      <p><strong>Время в пути:</strong> ~{{ routeInfo.duration }} мин</p>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'RouteMap',
  props: {
    points: {
      type: Array,
      required: true,
      validator: value => value.length === 2 && 
        value.every(p => p.lat && p.lng && p.name)
    },
    apiKey: {
      type: String,
      default: '5b3ce3597851110001cf6248e27fb267a0444c0db60b34b0519762e6' // Демо-ключ
    }
  },
  setup(props) {
    const mapContainer = ref(null);
    const map = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const routeInfo = ref(null);
    
    // Инициализация карты
    const initMap = () => {
      if (!mapContainer.value) return;
      
      map.value = L.map(mapContainer.value).setView([59.94, 30.31], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map.value);
    };
    
    // Кастомные иконки для маркеров
    const createCustomIcon = (color) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="white" cx="12" cy="9" r="3"/>
          </svg>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
    };
    
    // Получение маршрута
    const fetchRoute = async () => {
      if (!props.points || props.points.length !== 2) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        const [start, end] = props.points;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${props.apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          throw new Error('Маршрут не найден');
        }
        
        const route = data.features[0];
        const distance = (route.properties.segments[0].distance / 1000).toFixed(1);
        const duration = Math.round(route.properties.segments[0].duration / 60);
        
        // Очищаем предыдущий маршрут
        map.value.eachLayer(layer => {
          if (layer instanceof L.GeoJSON || layer instanceof L.Marker) {
            map.value.removeLayer(layer);
          }
        });
        
        // Добавляем маркеры
        props.points.forEach((point, index) => {
          L.marker([point.lat, point.lng], {
            icon: createCustomIcon(index === 0 ? '#e74c3c' : '#3498db')
          })
          .bindPopup(`<b>${point.name}</b><br>Широта: ${point.lat.toFixed(5)}<br>Долгота: ${point.lng.toFixed(5)}`)
          .addTo(map.value);
        });
        
        // Добавляем маршрут
        L.geoJSON(route, {
          style: {
            color: '#9b59b6',
            weight: 5,
            opacity: 0.8
          }
        }).addTo(map.value);
        
        // Обновляем информацию
        routeInfo.value = {
          startName: start.name,
          endName: end.name,
          distance: distance,
          duration: duration
        };
        
        // Масштабируем карту
        const routeLayer = L.geoJSON(route);
        map.value.fitBounds(routeLayer.getBounds().pad(0.2));
        
      } catch (err) {
        console.error('Ошибка построения маршрута:', err);
        error.value = `Ошибка: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };
    
    // Инициализация при монтировании
    onMounted(() => {
      initMap();
      fetchRoute();
    });
    
    // Следим за изменением точек
    watch(() => props.points, fetchRoute, { deep: true });
    
    return {
      mapContainer,
      loading,
      error,
      routeInfo
    };
  }
};
</script>

<style scoped>
.route-map-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.route-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: gray;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 500;
  max-width: 300px;
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffebee;
  color: #c62828;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.custom-marker {
  background: transparent;
  border: none;
}
</style>