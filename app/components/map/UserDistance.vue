<script setup lang="ts">
defineProps<{
  user1Avatar: string
  user2Avatar: string
  distance: number
}>()
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
      <USeparator type="dashed" color="primary" :label="`${distance} км`" />
    </div>
    <UAvatar
      :src="user2Avatar"
      alt="U 2"
      size="md"
      class="size-10"
    />
  </div>
</template>
