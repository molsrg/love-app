<script lang="ts" setup>
const emit = defineEmits<{
  add: []
  delete: [id: string]
}>()

const { t } = useI18n()
const wishlistStore = useWishlistStore()
</script>

<template>
  <div class="space-y-2">
    <div v-if="wishlistStore.isLoadingMine" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
    </div>

    <template v-else-if="wishlistStore.myItems.length > 0">
      <WishCard
        v-for="(item, index) in wishlistStore.myItems"
        :key="item.id"
        :item="item"
        own
        class="animate-slide-up opacity-0 translate-y-5"
        :style="`animation-delay: ${0.2 + index * 0.05}s`"
        @delete="emit('delete', $event)"
      />
    </template>

    <div v-else class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
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
  </div>
</template>
