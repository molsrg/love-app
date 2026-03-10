<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { CreateWishlistItemRequest } from '~/utils/wishlist.api'
import { BackButton } from 'vue-tg'

const { t } = useI18n()
const { telegramNotificationOccurred } = useHapticFeedback()
const wishlistStore = useWishlistStore()

const activeTab = ref('mine')
const isAddDrawerOpen = ref(false)

const tabs: TabsItem[] = [
  { label: t('wishlist.tabs.mine'), value: 'mine', icon: 'i-lucide-list-heart' },
  { label: t('wishlist.tabs.partner'), value: 'partner', icon: 'i-lucide-heart-handshake' },
]

onMounted(async () => {
  await Promise.all([
    wishlistStore.fetchMyWishlist(),
    wishlistStore.fetchPartnerWishlist(),
  ])
})

async function handleAdd(data: CreateWishlistItemRequest) {
  try {
    await wishlistStore.addItem(data)
    telegramNotificationOccurred('success')
    isAddDrawerOpen.value = false
  }
  catch {
    telegramNotificationOccurred('error')
  }
}

async function handleDelete(id: string) {
  const item = wishlistStore.myItems.find(i => i.id === id)
  if (!item)
    return

  const message = item.isBooked ? t('wishlist.confirmDelete') : t('wishlist.confirmDeletePlain')
  if (!confirm(message))
    return

  try {
    await wishlistStore.removeItem(id)
    telegramNotificationOccurred('success')
  }
  catch {
    telegramNotificationOccurred('error')
  }
}

async function handleBook(id: string) {
  try {
    await wishlistStore.bookItem(id)
    telegramNotificationOccurred('success')
  }
  catch {
    telegramNotificationOccurred('error')
  }
}

async function handleUnbook(id: string) {
  try {
    await wishlistStore.unbookItem(id)
    telegramNotificationOccurred('success')
  }
  catch {
    telegramNotificationOccurred('error')
  }
}
</script>

<template>
  <BackButton @click="navigateTo('/')" />
  <div class="space-y-1">
    <div class="flex items-center justify-between animate-fade-in">
      <h1 class="text-2xl font-bold text-white">
        {{ t('wishlist.title') }}
      </h1>
      <UButton
        v-if="activeTab === 'mine' && wishlistStore.myItems.length > 0"
        size="sm"
        color="primary"
        variant="subtle"
        leading-icon="i-lucide-plus"
        :label="t('wishlist.add')"
        class="animate-slide-up opacity-0 translate-y-5"
        style="animation-delay: 0.1s"
        @click="isAddDrawerOpen = true"
      />
    </div>

    <UTabs
      v-model="activeTab"
      :items="tabs"
      :content="false"
      class="animate-slide-up opacity-0 translate-y-5"
      style="animation-delay: 0.15s"
    />

    <div v-if="activeTab === 'mine'" class="space-y-2">
      <div
        v-if="wishlistStore.isLoadingMine"
        class="flex justify-center py-8"
      >
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
          @delete="handleDelete"
        />
      </template>

      <div
        v-else
        class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in"
      >
        <UIcon name="i-lucide-gift" class="text-primary/40 size-16" />
        <p class="text-gray-400 text-center">
          {{ t('wishlist.empty.mine') }}
        </p>
        <UButton
          color="primary"
          variant="subtle"
          leading-icon="i-lucide-plus"
          :label="t('wishlist.add')"
          @click="isAddDrawerOpen = true"
        />
      </div>
    </div>

    <div v-else class="space-y-2">
      <div
        v-if="wishlistStore.isLoadingPartner"
        class="flex justify-center py-8"
      >
        <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
      </div>

      <template v-else-if="wishlistStore.partnerItems.length > 0">
        <WishCard
          v-for="(item, index) in wishlistStore.partnerItems"
          :key="item.id"
          :item="item"
          class="animate-slide-up opacity-0 translate-y-5"
          :style="`animation-delay: ${0.2 + index * 0.05}s`"
          @book="handleBook"
          @unbook="handleUnbook"
        />
      </template>

      <div
        v-else
        class="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in"
      >
        <UIcon name="i-lucide-heart" class="text-primary/40 size-16" />
        <p class="text-gray-400 text-center">
          {{ t('wishlist.empty.partner') }}
        </p>
      </div>
    </div>

    <AddWishDrawer v-model:open="isAddDrawerOpen" @submit="handleAdd" />
  </div>
</template>
