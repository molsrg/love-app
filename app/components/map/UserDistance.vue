<script setup lang="ts">
const props = defineProps<{
  user1Avatar: string
  user2Avatar: string
  distance: number
}>()

const animatedDistance = ref(0)

const easeOutQuad = (t: number) => t * (2 - t)

watch(() => props.distance, (newValue) => {
  const duration = 2000
  const startTime = performance.now()
  const startValue = animatedDistance.value

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easedProgress = easeOutQuad(progress)
    animatedDistance.value = Math.round(startValue + (newValue - startValue) * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}, { immediate: true })
</script>

<template>
  <div class="rounded-lg p-4 flex w-full items-center bg-elevated/50 gap-3">
    <UAvatar
      :src="user1Avatar"
      alt="U 1"
      size="md"
      class="size-10"
    />
    <div class="flex-1">
      <USeparator type="dashed" color="primary" :label="`${animatedDistance} км`" />
    </div>
    <UAvatar
      :src="user2Avatar"
      alt="U 2"
      size="md"
      class="size-10"
    />
  </div>
</template>
