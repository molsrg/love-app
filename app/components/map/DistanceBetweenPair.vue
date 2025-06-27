<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  user1Avatar: string
  user2Avatar: string
  distance: number
}>()

const animatedDistance = ref(0)

watch(() => props.distance, (newValue) => {
  animatedDistance.value = 0

  setTimeout(() => {
    gsap.to(animatedDistance, {
      value: newValue,
      duration: 3,
      ease: 'power3.out',
      snap: { value: 0.1 },
      overwrite: true,
      onUpdate: () => {
        animatedDistance.value = Math.round(animatedDistance.value * 10) / 10
      },
    })
  }, 100)
}, { immediate: true })

const distanceText = computed(() => {
  if (animatedDistance.value < 1000) {
    return 'вы вместе!'
  }
  return `${(animatedDistance.value / 1000).toFixed(1)} км`
})
</script>

<template>
  <div class="rounded-lg p-4 flex  items-center bg-elevated/50 gap-2">
    <UAvatar
      :src="user1Avatar"
      alt="U 1"
      size="3xl"
    />
    <div class="flex-1">
      <USeparator
        type="dashed"
        size="sm" color="primary" :ui="{
          container: 'flex-col gap-0.5 justify-center ',
        }"
      >
        <h2>{{ distanceText }}</h2>
        <UBadge variant="subtle" v-if="animatedDistance > 1000" label="между вами" />
      </USeparator>
    </div>
    <UAvatar
      :src="user2Avatar"
      alt="U 2"
      size="3xl"
    />
  </div>
</template>
