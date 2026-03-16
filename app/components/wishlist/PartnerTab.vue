<script lang="ts" setup>
const emit = defineEmits<{
  book: [id: string]
  unbook: [id: string]
}>()

const { t } = useI18n()
const wishlistStore = useWishlistStore()

const activePartnerItems = computed(() =>
  wishlistStore.partnerItems.filter(i => !i.isReceived),
)
</script>

<template>
  <div class="space-y-2 -mt-2 mb-2">
    <div v-if="wishlistStore.isLoadingPartner" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
    </div>

    <template v-else-if="activePartnerItems.length > 0">
      <WishCard
        v-for="(item, index) in activePartnerItems"
        :key="item.id"
        :item="item"
        class="animate-slide-up opacity-0 translate-y-5"
        :style="`animation-delay: ${0.2 + index * 0.05}s`"
        @book="emit('book', $event)"
        @unbook="emit('unbook', $event)"
      />
    </template>

    <div v-else class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
      <UIcon name="i-lucide-heart-handshake" class="text-primary/40 size-16" />
      <p class="text-gray-400 text-center">
        {{ t('wishlist.empty.partner') }}
      </p>
    </div>
  </div>
</template>
