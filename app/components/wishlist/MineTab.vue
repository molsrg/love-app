<script lang="ts" setup>
const emit = defineEmits<{
  add: []
  delete: [id: string]
  receive: [id: string]
}>()

const { t } = useI18n()
const wishlistStore = useWishlistStore()

const activeItems = computed(() =>
  wishlistStore.myItems
    .filter(i => !i.isReceived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
const archivedItems = computed(() =>
  wishlistStore.myItems.filter(i => i.isReceived),
)
</script>

<template>
  <div class="space-y-2 -mt-2 mb-2">
    <div v-if="wishlistStore.isLoadingMine" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
    </div>

    <template v-else-if="activeItems.length > 0">
      <WishCard
        v-for="(item, index) in activeItems"
        :key="item.id"
        :item="item"
        own
        class="animate-slide-up opacity-0 translate-y-5"
        :style="`animation-delay: ${0.2 + index * 0.05}s`"
        @delete="emit('delete', $event)"
        @receive="emit('receive', $event)"
      />
    </template>

    <div v-else-if="!wishlistStore.isLoadingMine && activeItems.length === 0 && archivedItems.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
      <UIcon name="i-lucide-gift" class="text-primary/40 size-16" />
      <p class="text-gray-400 text-center">
        {{ t('wishlist.empty.mine') }}
      </p>
      <UButton
        color="primary"
        variant="subtle"
        leading-icon="i-lucide-plus"
        :label="t('wishlist.add')"
        @click="emit('add')"
      />
    </div>

    <UCollapsible v-if="archivedItems.length > 0" class="group animate-slide-up opacity-0 translate-y-5 mb-4" :style="`animation-delay: ${0.2 + activeItems.length * 0.05}s`">
      <button class="flex w-full items-center gap-3 py-1 cursor-pointer">
        <div class="h-px flex-1 bg-border" />
        <span class="flex items-center gap-1.5 text-xs text-muted select-none">
          <UIcon name="i-lucide-archive" class="size-3.5" />
          {{ t('wishlist.archive') }} ({{ archivedItems.length }})
          <UIcon
            name="i-lucide-chevron-down"
            class="size-3.5 group-data-[state=open]:rotate-180 transition-transform duration-200"
          />
        </span>
        <div class="h-px flex-1 bg-border" />
      </button>
      <template #content>
        <div class="space-y-2 mt-2">
          <WishCard
            v-for="(item, index) in archivedItems"
            :key="item.id"
            :item="item"
            class="opacity-60"
            :style="`animation-delay: ${index * 0.05}s`"
          />
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
