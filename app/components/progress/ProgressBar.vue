<script setup lang="ts">
const props = defineProps<{
  total?: number
  progress?: number
  percent?: number
  transitionDuration?: number
}>()

const total = computed(() => props.total ?? 1)
const duration = computed(() => `${props.transitionDuration ?? 0.3}s`)

const fillPercent = computed(() => {
  const w = props.percent != null
    ? props.percent * 100
    : total.value > 0 ? (props.progress ?? 0) / total.value * 100 : 0
  return Math.min(Math.max(w, 0), 100)
})

const fillWidth = computed(() => `${fillPercent.value}%`)
</script>

<template>
  <div class="relative">
    <div class="relative h-2 w-full overflow-hidden rounded-full bg-elevated">
      <div class="progress-fill h-full rounded-full bg-primary" :style="{ width: fillWidth }" />
    </div>
  </div>
</template>

<style scoped>
.progress-fill {
  transition: width v-bind(duration) ease;
  background-image: linear-gradient(45deg,
      rgba(255, 255, 255, 0.12) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.12) 75%,
      transparent 75%,
      transparent);
  background-size: 0.75rem 0.75rem;
  animation: stripes 1s linear infinite;
}

@keyframes stripes {
  from {
    background-position-x: 0.75rem;
  }

  to {
    background-position-x: 0;
  }
}
</style>
