<script lang="ts" setup>
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

type AllowedColor = 'warning' | 'error' | 'success'

function getUserStatus(user: any) {
  if (!user?.geo?.timestamp) {
    return {
      isOnline: false,
      color: 'error' as AllowedColor,
      label: 'оффлайн',
    }
  }

  const now = new Date()
  const lastSeenDate = new Date(user.geo?.timestamp)
  const diffMinutes = Math.round((now.getTime() - lastSeenDate.getTime()) / 60000)

  if (diffMinutes <= 2) {
    return {
      isOnline: true,
      color: 'success' as AllowedColor,
      label: 'онлайн',
    }
  }

  if (diffMinutes < 60) {
    return {
      isOnline: false,
      color: 'error' as AllowedColor,
      label: `${diffMinutes} мин. назад`,
    }
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return {
      isOnline: false,
      color: 'error' as AllowedColor,
      label: `${diffHours} ч. назад`,
    }
  }

  const diffDays = Math.round(diffHours / 24)
  return {
    isOnline: false,
    color: 'error' as AllowedColor,
    label: `${diffDays} д. назад`,
  }
}

const user1Status = computed(() => getUserStatus(props.user1))
const user2Status = computed(() => getUserStatus(props.user2))
</script>

<template>
  <div class="flex flex-col gap-3 p-4 bg-elevated/50 rounded-lg animate-initial animate-slide-up">
  
    <div class="flex items-center gap-2">
      <UChip inset :color="user1Status.color">
        <UAvatar :src="user1.avatar" size="xl" />
      </UChip>
      <div class="flex-1 ">
        <USeparator
          type="dashed"
          size="sm"
          :color="user1Status.color"
        />
      </div>
      <div class="flex gap-1">
        <UBadge :color="user1Status.color" variant="subtle" :label="user1Status.label" />
        <UBadge
          v-if="!user1.geo?.approveGeo"
          color="warning"
          variant="subtle"
          label="нет доступа к геопозиции!"
        />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <UChip inset :color="user2Status.color">
        <UAvatar :src="user2.avatar" size="xl" />
      </UChip>
      <div class="flex-1 ">
        <USeparator
          type="dashed"
          size="sm"
          :color="user2Status.color"
        />
      </div>
      <div class="flex gap-1">
        <UBadge :color="user2Status.color" variant="subtle" :label="user2Status.label" />
        <UBadge
          v-if="!user2.approveGeo"
          color="warning"
          variant="subtle"
          label="нет доступа к геопозиции!"
        />
      </div>
    </div>
  </div>
</template>

<style>

</style>
