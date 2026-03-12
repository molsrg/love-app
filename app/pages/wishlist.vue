<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { JointGiftResponse, Share } from '~/utils/joint-gift.api'
import { BackButton } from 'vue-tg'

const { t } = useI18n()
const { telegramNotificationOccurred } = useHapticFeedback()
const wishlistStore = useWishlistStore()
const jointGiftStore = useJointGiftStore()
const pairStore = usePairStore()

const activeTab = ref('mine')
const isAddDrawerOpen = ref(false)
const isAddLoading = ref(false)
const isAddJointDrawerOpen = ref(false)
const isAddJointLoading = ref(false)
const isContributeOpen = ref(false)
const isContributeLoading = ref(false)
const contributeTarget = ref<{ gift: JointGiftResponse, myShare: Share } | null>(null)

const tabs: TabsItem[] = [
  { label: t('wishlist.tabs.mine'), value: 'mine', icon: 'i-lucide-gift' },
  { label: t('wishlist.tabs.partner'), value: 'partner', icon: 'i-lucide-heart-handshake' },
  { label: t('wishlist.tabs.joint'), value: 'joint', icon: 'i-lucide-handshake' },
]

onMounted(async () => {
  await Promise.all([
    wishlistStore.fetchMyWishlist(),
    wishlistStore.fetchPartnerWishlist(),
    jointGiftStore.fetchAll(),
  ])
})

async function handleAdd(data: FormData) {
  isAddLoading.value = true
  try {
    await wishlistStore.addItem(data)
    telegramNotificationOccurred('success')
    isAddDrawerOpen.value = false
  }
  catch {
    telegramNotificationOccurred('error')
  }
  finally {
    isAddLoading.value = false
  }
}

async function handleDelete(id: string) {
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

async function handleJointAdd(data: FormData) {
  isAddJointLoading.value = true
  try {
    await jointGiftStore.createItem(data)
    telegramNotificationOccurred('success')
    isAddJointDrawerOpen.value = false
  }
  catch {
    telegramNotificationOccurred('error')
  }
  finally {
    isAddJointLoading.value = false
  }
}

function handleContributeOpen(id: string) {
  const gift = jointGiftStore.items.find(g => g.id === id)
  if (!gift)
    return
  const myShare = gift.shares.find(s => s.userId === pairStore.user1.id)
  if (!myShare)
    return
  contributeTarget.value = { gift, myShare }
  isContributeOpen.value = true
}

async function handleContribute(amount: number) {
  if (!contributeTarget.value)
    return
  isContributeLoading.value = true
  try {
    await jointGiftStore.contributeToItem(contributeTarget.value.gift.id, amount)
    telegramNotificationOccurred('success')
    isContributeOpen.value = false
  }
  catch {
    telegramNotificationOccurred('error')
  }
  finally {
    isContributeLoading.value = false
  }
}

async function handleJointComplete(id: string) {
  try {
    await jointGiftStore.completeItem(id)
    telegramNotificationOccurred('success')
  }
  catch {
    telegramNotificationOccurred('error')
  }
}

async function handleJointDelete(id: string) {
  try {
    await jointGiftStore.removeItem(id)
    telegramNotificationOccurred('success')
  }
  catch {
    telegramNotificationOccurred('error')
  }
}

function handleBackButton() {
  navigateTo('/')
}
</script>

<template>
  <div class="space-y-2.5">
    <BackButton @click="handleBackButton" />
    <div class="flex items-center justify-between animate-fade-in">
      <h1 class="text-2xl font-bold text-white">
        {{ t('wishlist.title') }}
      </h1>
      <UButton
        v-if="activeTab === 'mine' && wishlistStore.myItems.length > 0"
        size="md"
        color="primary"
        variant="subtle"
        leading-icon="i-lucide-plus"
        :label="t('wishlist.add')"
        @click="isAddDrawerOpen = true"
      />
      <UButton
        v-else-if="activeTab === 'joint' && jointGiftStore.items.length > 0 && pairStore.isHost"
        size="md"
        color="primary"
        variant="subtle"
        leading-icon="i-lucide-plus"
        :label="t('wishlist.joint.add')"
        @click="isAddJointDrawerOpen = true"
      />
    </div>

    <UTabs
      v-model="activeTab"
      :items="tabs"
      :content="false"
      class="animate-slide-up opacity-0 translate-y-5 -mt-3"
      style="animation-delay: 0.15s"
    />

    <MineTab
      v-if="activeTab === 'mine'"
      @add="isAddDrawerOpen = true"
      @delete="handleDelete"
    />
    <PartnerTab
      v-else-if="activeTab === 'partner'"
      @book="handleBook"
      @unbook="handleUnbook"
    />
    <JointTab
      v-else
      @add="isAddJointDrawerOpen = true"
      @contribute="handleContributeOpen"
      @complete="handleJointComplete"
      @delete="handleJointDelete"
    />

    <AddWishDrawer v-model:open="isAddDrawerOpen" :loading="isAddLoading" @submit="handleAdd" />
    <AddJointGiftDrawer v-if="pairStore.isHost" v-model:open="isAddJointDrawerOpen" :loading="isAddJointLoading" @submit="handleJointAdd" />
    <ContributeDrawer
      v-if="contributeTarget"
      v-model:open="isContributeOpen"
      :gift="contributeTarget.gift"
      :my-share="contributeTarget.myShare"
      :loading="isContributeLoading"
      @submit="handleContribute"
    />
  </div>
</template>
