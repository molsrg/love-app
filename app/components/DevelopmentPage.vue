<script setup lang="ts">
defineProps<{
  text?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center" style="z-index: 40;">
    <div class="absolute inset-0  backdrop-blur-md pointer-events-auto" />
    <div class="relative pointer-events-none flex flex-col items-center gap-2">
      <slot />
    </div>
  </div>
</template>
