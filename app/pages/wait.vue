<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col items-center justify-center ">
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

    <h1 class="text-2xl font-bold text-white mb-2 text-center">
      Ожидание инициализации
    </h1>
    <p class="text-lg text-gray-300 text-center max-w-xs">
      Приложение инициируется хостом<br>Пожалуйста, подождите пару секунд...
    </p>
  </div>
</template>
