<script setup lang="ts">
const props = defineProps<{
  name: string
  size?: number | string
  alt?: string
}>()

const src = computed(() => `/svg/${props.name}.svg`)
const iconSize = computed(() => typeof props.size === 'number' ? `${props.size}px` : (props.size || '32px'))
</script>

<template>
  <img
    :src="src"
    :alt="props.alt || props.name"
    :width="iconSize"
    :height="iconSize"
    loading="eager"
    draggable="false"
    style="display: inline-block; vertical-align: middle;"
  >
</template>
