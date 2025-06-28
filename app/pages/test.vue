<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useLocationManager } from 'vue-tg'

const locationManager = useLocationManager()
const location = ref(null)
const errorMessage = ref('')
const locationHistory = ref([])
const locationInterval = null

// Initialize LocationManager when component is mounted
// onMounted(async () => {
//   try {
//     await locationManager.init()

//     // Set up event handlers
//     locationManager.onManagerUpdate((update) => {
//       console.log('Location manager updated:', update)
//     })

//     locationManager.onRequest((request) => {
//       console.log('Location request:', request)
//     })

//     // Start periodic location requests
//     startLocationWatcher()
//   }
//   catch (error) {
//     console.error('Failed to initialize LocationManager:', error)
//     errorMessage.value = 'Failed to initialize location services'
//   }
// })

// Clean up interval when component is unmounted
onUnmounted(() => {
  if (locationInterval) {
    clearInterval(locationInterval)
  }
})

// function startLocationWatcher() {
//   locationInterval = setInterval(async () => {
//     try {
//       const loc = await locationManager.getLocation()
//       if (loc) {
//         location.value = loc
//         locationHistory.value.push({
//           ...loc,
//           timestamp: Date.now(),
//         })
//         errorMessage.value = ''
//       }
//     }
//     catch (error) {
//       console.error('Error getting location in watcher:', error)
//     }
//   }, 3000)
// }

const buttonText = computed(() => {
  if (!locationManager.isInited)
    return 'Initializing...'
  if (locationManager.isAccessRequested) {
    return locationManager.isAccessGranted ? 'Location granted' : 'Access denied'
  }
  return 'Request Location'
})

async function requestLocation() {
  if (!locationManager.isInited) {
    errorMessage.value = 'Location manager not initialized yet'
    return
  }

  if (!locationManager.isLocationAvailable) {
    errorMessage.value = 'Location services are not available on this device'
    return
  }

  try {
    const loc = await locationManager.getLocation()

    if (loc) {
      location.value = loc
      locationHistory.value.push({
        ...loc,
        timestamp: Date.now(),
      })
      errorMessage.value = ''
    }
    else {
      errorMessage.value = 'Location access was denied'
    }
  }
  catch (error) {
    console.error('Error getting location:', error)
    errorMessage.value = 'Error getting location'
  }
}

function openSettings() {
  locationManager.openSettings()
}
</script>

<template>
  <div class="location-page">
    <h1>Location Manager Demo</h1>

    {{ locationManager }}

    <button
      :disabled="!locationManager.isInited"
      @click="requestLocation"
    >
      {{ buttonText }}
    </button>

    <div v-if="location" class="location-info">
      <h2>Your Location:</h2>
      <p>Latitude: {{ location.latitude }}</p>
      <p>Longitude: {{ location.longitude }}</p>
      <p v-if="location.horizontal_accuracy">
        Accuracy: {{ location.horizontal_accuracy }} meters
      </p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <button
      v-if="locationManager.isAccessRequested && !locationManager.isAccessGranted"
      class="settings-button"
      @click="openSettings"
    >
      Open Location Settings
    </button>

    <div class="location-history">
      <h2>Location History:</h2>
      <div v-for="(loc, index) in locationHistory" :key="index" class="history-item">
        <p>Time: {{ new Date(loc.timestamp).toLocaleTimeString() }}</p>
        <p>Latitude: {{ loc.latitude }}</p>
        <p>Longitude: {{ loc.longitude }}</p>
        <p v-if="loc.horizontal_accuracy">
          Accuracy: {{ loc.horizontal_accuracy }} meters
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-page {
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px 0;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.settings-button {
  background-color: #ff6b6b;
}

.location-info {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  text-align: left;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #ffdddd;
  border-radius: 5px;
  color: #ff0000;
}

.location-history {
  margin-top: 30px;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: left;
}
</style>
