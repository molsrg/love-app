<script setup lang="ts">
import { pollingService } from '~/services/polling.service'

definePageMeta({
  layout: 'unauthorized',
})

function handlePingResponse(data: any) {
  if (data?.ready) {
    pollingService.stop()
    navigateTo('/success')
  }
}
const config = useRuntimeConfig()
onMounted(() => {
  pollingService.start(config.public.initUrl, handlePingResponse, 3000)
})

onUnmounted(() => {
  pollingService.stop()
})
</script>

<template>
  <div class="relative" style="height: 80vh;">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
      <svg width="120" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
        <path
          fill="none"
          stroke="#FFFFFF"
          stroke-width="15"
          stroke-linecap="round"
          stroke-dasharray="300 385"
          stroke-dashoffset="0"
          d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
        >
          <animate
            attributeName="stroke-dashoffset"
            calcMode="spline"
            dur="6.7"
            values="685;-685"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <h1 class="text-2xl font-bold text-white  text-center mt-4">
        Почти готово!
      </h1>
      <p class="text-lg text-gray-300 text-center p-2">
        Подождите, пока партнёр завершит настройку
      </p>
    </div>
  </div>
</template>
