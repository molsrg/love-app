<script lang="ts" setup>
import type { PartnerWishlistItemResponse, WishlistItemResponse } from '~/utils/wishlist.api'

const props = defineProps<{
  item: WishlistItemResponse | PartnerWishlistItemResponse
  own?: boolean
}>()

const emit = defineEmits<{
  delete: [id: string]
  book: [id: string]
  unbook: [id: string]
}>()

const { t } = useI18n()

const isLoading = ref(false)

watch(() => props.item, () => {
  isLoading.value = false
}, { deep: true })

function handleAction(action: () => void) {
  isLoading.value = true
  action()
}

const formattedPrice = computed(() => {
  if (props.item.price == null)
    return null
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(props.item.price)
})
</script>

<template>
  <UCard variant="subtle" class="w-full relative">
    <div v-if="isLoading" class="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center z-10">
      <UIcon name="i-lucide-loader-circle" class="text-primary size-6 animate-spin" />
    </div>
    <div class="flex gap-3">
      <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-elevated flex items-center justify-center">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.title"
          class="w-full h-full object-cover"
        >
        <UIcon v-else name="i-lucide-gift" class="text-primary size-8" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <p class="font-semibold text-white truncate">
            {{ item.title }}
          </p>
          <UBadge v-if="formattedPrice" :label="formattedPrice" color="primary" variant="subtle" size="sm" class="flex-shrink-0" />
        </div>

        <p v-if="item.description" class="text-sm text-gray-400 line-clamp-2 mt-0.5">
          {{ item.description }}
        </p>

        <div v-if="item.isBooked && own" class="flex items-center gap-1 mt-1">
          <UIcon name="i-lucide-eye" class="text-primary size-3.5 flex-shrink-0" />
          <span class="text-xs text-primary">{{ t('wishlist.card.booked') }}</span>
        </div>

        <div v-if="item.isBooked && !own" class="flex items-center gap-1 mt-1">
          <UIcon name="i-lucide-check-circle" class="text-primary size-3.5 flex-shrink-0" />
          <span class="text-xs text-primary">{{ t('wishlist.card.bookedByYou') }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
      <UButton
        v-if="item.link"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        size="xs"
        color="neutral"
        variant="subtle"
        leading-icon="i-lucide-external-link"
        :label="t('wishlist.actions.openLink')"
      />
      <div v-else />

      <div class="flex items-center gap-2">
        <template v-if="own">
          <UButton
            size="xs"
            color="error"
            variant="subtle"
            leading-icon="i-lucide-trash-2"
            :label="t('wishlist.actions.delete')"
            @click="handleAction(() => emit('delete', item.id))"
          />
        </template>

        <template v-else>
          <UButton
            size="xs"
            :color="item.isBooked ? 'neutral' : 'primary'"
            variant="subtle"
            :leading-icon="item.isBooked ? 'i-lucide-bookmark-x' : 'i-lucide-bookmark'"
            :label="item.isBooked ? t('wishlist.actions.unbook') : t('wishlist.actions.book')"
            @click="handleAction(() => item.isBooked ? emit('unbook', item.id) : emit('book', item.id))"
          />
        </template>
      </div>
    </div>
  </UCard>
</template>
