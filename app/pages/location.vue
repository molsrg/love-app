



<template>
  <div>
    <RouteMap :points="routePoints" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RouteMap from '../components/map/RouteMap.vue'

const routePoints = ref([
  {
    lat: 59.867290,
    lng: 30.307911,
    name: "Санкт-Петербург"
  },
  {
    lat: 59.2205,
    lng: 39.8915,
    name: "Вологда"
  }
])
</script>

<style scoped>
div {
  width: 100%;
  height: 100vh;
}
</style>