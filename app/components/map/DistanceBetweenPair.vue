<script setup lang="ts">


const props = defineProps<{
  user1Avatar: string
  user2Avatar: string
  distance: number
}>()

const {t} = useI18n()

const { animatedValue, animateTo } = useAnimatedNumber(0, 3, 200)

watch(() => props.distance, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    animateTo(newValue)
  }
}, { immediate: true })

const distanceText = computed(() => {
  if (animatedValue.value < 1000) {
    return t('distance.together')
  }
  return t('distance.kilometers', { value: (animatedValue.value / 1000).toFixed(1) })
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
        <UBadge v-if="animatedValue > 1000" variant="subtle" :label="t('distance.between')" />
      </USeparator>
    </div>
    <UAvatar
      :src="user2Avatar"
      alt="U 2"
      size="3xl"
    />
  </div>
</template>
