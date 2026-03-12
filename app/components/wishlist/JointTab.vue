<script lang="ts" setup>
const emit = defineEmits<{
  add: []
  contribute: [id: string]
  complete: [id: string]
  delete: [id: string]
}>()

const { t } = useI18n()
const jointGiftStore = useJointGiftStore()
const pairStore = usePairStore()
</script>

<template>
  <div class="space-y-2">
    <div v-if="jointGiftStore.isLoading" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
    </div>

    <template v-else-if="jointGiftStore.items.length > 0">
      <JointGiftCard
        v-for="(gift, index) in jointGiftStore.items"
        :key="gift.id"
        :gift="gift"
        class="animate-slide-up opacity-0 translate-y-5"
        :style="`animation-delay: ${0.2 + index * 0.05}s`"
        @contribute="emit('contribute', $event)"
        @complete="emit('complete', $event)"
        @delete="emit('delete', $event)"
      />
    </template>

    <div v-else class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
      <UIcon name="i-lucide-handshake" class="text-primary/40 size-16" />
      <p class="text-gray-400 text-center">
        {{ t('wishlist.joint.empty') }}
      </p>
      <UButton
        v-if="pairStore.isHost"
        color="primary"
        variant="subtle"
        leading-icon="i-lucide-plus"
        :label="t('wishlist.joint.add')"
        @click="emit('add')"
      />
    </div>
  </div>
</template>
