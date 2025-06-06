<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentDays: number
  targetDays: number
}>()

const progress = computed(() => {
  return (props.currentDays / props.targetDays) * 100
})

const isCompleted = computed(() => {
  return props.currentDays >= props.targetDays
})

const visualProgress = computed(() => {
  return Math.min(progress.value, 100)
})

const circumference = 2 * Math.PI * 40
const strokeDashoffset = computed(() => {
  return circumference - (visualProgress.value / 100) * circumference
})
</script>

<template>
  <div class="relative w-[90px] h-[90px]">
    <svg class="w-full h-full transform -rotate-90">
      <!-- Background circle -->
      <circle
        cx="45"
        cy="45"
        r="40"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
        class="text-gray-700"
      />
      <!-- Progress circle -->
      <circle
        cx="45"
        cy="45"
        r="40"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
        :stroke-dasharray="circumference"
        :style="{ '--dashoffset': strokeDashoffset }"
        class="progress-circle" :class="[
          isCompleted ? 'text-primary' : 'text-primary',
        ]"
      />
    </svg>
    <!-- Center text -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <template v-if="isCompleted">
        <UIcon name="i-heroicons-check-circle" class="text-2xl text-success mb-1" />
        <span class="text-xs text-gray-400">{{ targetDays }} дней</span>
      </template>
      <template v-else>
        <span class="text-md font-bold text-white">{{ Math.round(progress) }}%</span>
        <span class="text-xs text-gray-400">{{ targetDays }} дней</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.relative {
  animation: scaleIn 0.5s ease-out forwards;
}

.progress-circle {
  stroke-dashoffset: var(--dashoffset);
  animation: progress 2s ease-out forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    stroke-dashoffset: 251.2;
  }
  to {
    stroke-dashoffset: var(--dashoffset);
  }
}
</style>
