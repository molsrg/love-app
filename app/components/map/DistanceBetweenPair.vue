<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  user1Avatar: string
  user2Avatar: string
  distance: number
}>()

const animatedDistance = ref(0)
let tween: gsap.core.Tween | null = null
let delayTimeout: ReturnType<typeof setTimeout> | null = null
const { t } = useI18n()

function animateDistance(newValue: number) {
  if (tween)
    tween.kill()
  if (delayTimeout)
    clearTimeout(delayTimeout)
  delayTimeout = setTimeout(() => {
    tween = gsap.to(animatedDistance, {
      value: newValue,
      duration: 3,
      ease: 'power3.out',
      snap: { value: 0.1 },
      overwrite: true,
    })
  }, 200)
}

watch(() => props.distance, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    animateDistance(newValue)
  }
}, { immediate: true })

onUnmounted(() => {
  if (tween)
    tween.kill()
  if (delayTimeout)
    clearTimeout(delayTimeout)
})

const distanceText = computed(() => {
  if (animatedDistance.value < 1000) {
    return t('distance.together')
  }
  return t('distance.kilometers', { value: (animatedDistance.value / 1000).toFixed(1) })
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
        <UBadge v-if="animatedDistance > 1000" variant="subtle" :label="t('distance.between')" />
      </USeparator>
    </div>
    <UAvatar
      :src="user2Avatar"
      alt="U 2"
      size="3xl"
    />
  </div>
</template>
