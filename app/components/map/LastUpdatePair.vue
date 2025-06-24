<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  user1: {
    type: Object,
    required: true,
  },
  user2: {
    type: Object,
    required: true,
  },
})

function getStatus(user: any) {
  if (!user?.lastSeen)
    return { isOnline: false, label: 'оффлайн' }

  const now = new Date()
  const lastSeenDate = new Date(user.lastSeen)
  const diffMinutes = Math.round((now.getTime() - lastSeenDate.getTime()) / 60000)

  if (diffMinutes <= 5)
    return { isOnline: true, label: 'онлайн' }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24)
    return { isOnline: false, label: `${diffHours} ч. назад` }

  const diffDays = Math.round(diffHours / 24)
  return { isOnline: false, label: `${diffDays} д. назад` }
}

const user1Status = computed(() => getStatus(props.user1))
const user2Status = computed(() => getStatus(props.user2))
</script>

<template>
  <div class="flex flex-col gap-3 p-4 bg-elevated/50 rounded-lg animate-initial animate-slide-up">
    <div class="flex items-center gap-3">
      <UChip inset :color="user1Status.isOnline ? 'success' : 'error'">
        <UAvatar :src="user1.avatar" size="xl" />
      </UChip>
      <div class="flex-1">
        <USeparator
          type="dashed"
          size="sm"
          :color="user1Status.isOnline ? 'success' : 'error'"
        />
      </div>
      <UBadge :color="user1Status.isOnline ? 'success' : 'error'" variant="subtle" :label="user1Status.label" />
    </div>
    <div class="flex items-center gap-3">
      <UChip inset :color="user2Status.isOnline ? 'success' : 'error'">
        <UAvatar :src="user2.avatar" size="xl" />
      </UChip>
      <div class="flex-1">
        <USeparator
          type="dashed"
          size="sm"
          :color="user2Status.isOnline ? 'success' : 'error'"
        />
      </div>
      <UBadge :color="user2Status.isOnline ? 'success' : 'error'" variant="subtle" :label="user2Status.label" />
    </div>
  </div>
</template>

<style>

</style>
