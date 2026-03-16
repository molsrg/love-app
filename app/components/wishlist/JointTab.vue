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

const activeItems = computed(() =>
  jointGiftStore.items
    .filter(g => g.status !== 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
const archivedItems = computed(() =>
  jointGiftStore.items.filter(g => g.status === 'completed'),
)
</script>

<template>
  <div class="space-y-2 -mt-2 mb-2">
    <div v-if="jointGiftStore.isLoading" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
    </div>

    <template v-else-if="activeItems.length > 0">
      <JointGiftCard
        v-for="(gift, index) in activeItems" :key="gift.id" :gift="gift"
        class="animate-slide-up opacity-0 translate-y-5" :style="`animation-delay: ${0.2 + index * 0.05}s`"
        @contribute="emit('contribute', $event)" @complete="emit('complete', $event)"
        @delete="emit('delete', $event)"
      />
    </template>

    <div
      v-else-if="!jointGiftStore.isLoading && activeItems.length === 0 && archivedItems.length === 0"
      class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in"
    >
      <UIcon name="i-lucide-handshake" class="text-primary/40 size-16" />
      <p class="text-gray-400 text-center">
        {{ t('wishlist.joint.empty') }}
      </p>
      <UButton
        v-if="pairStore.isHost" color="primary" variant="subtle" leading-icon="i-lucide-plus"
        :label="t('wishlist.joint.add')" @click="emit('add')"
      />
      <UCard v-else class="w-full mt-2" variant="subtle">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-info" class="text-primary shrink-0 size-5" />
          <p class="text-sm text-muted">
            {{ t('wishlist.joint.onlyHostCanAdd') }}
          </p>
        </div>
      </UCard>
    </div>

    <UCollapsible v-if="archivedItems.length > 0" class="group animate-slide-up opacity-0 translate-y-5 mb-4" :style="`animation-delay: ${0.2 + activeItems.length * 0.05}s`">
      <button class="flex w-full items-center gap-3 py-1 cursor-pointer">
        <div class="h-px flex-1 bg-border" />
        <span class="flex items-center gap-1.5 text-xs text-muted select-none">
          <UIcon name="i-lucide-archive" class="size-3.5" />
          {{ t('wishlist.joint.archive') }} ({{ archivedItems.length }})
          <UIcon
            name="i-lucide-chevron-down"
            class="size-3.5 group-data-[state=open]:rotate-180 transition-transform duration-200"
          />
        </span>
        <div class="h-px flex-1 bg-border" />
      </button>
      <template #content>
        <div class="space-y-2 mt-2">
          <JointGiftCard
            v-for="(gift, index) in archivedItems" :key="gift.id" :gift="gift" class="opacity-60"
            :style="`animation-delay: ${index * 0.05}s`" @contribute="emit('contribute', $event)"
            @complete="emit('complete', $event)" @delete="emit('delete', $event)"
          />
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
