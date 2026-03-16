<script lang="ts" setup>
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

const tabs = [
  { label: t('wishlist.tabs.mine'), value: 'mine', icon: 'i-lucide-gift' },
  { label: t('wishlist.tabs.partner'), value: 'partner', icon: 'i-lucide-heart-handshake' },
  { label: t('wishlist.tabs.joint'), value: 'joint', icon: 'i-lucide-handshake' },
]

const activeTabItem = computed(() => tabs.find(tab => tab.value === activeTab.value)!)

const tabMenuItems = computed(() =>
  tabs.map(tab => ({
    label: tab.label,
    icon: tab.icon,
    type: 'item' as const,
    active: tab.value === activeTab.value,
    onSelect() { activeTab.value = tab.value },
  })),
)

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

async function handleReceive(id: string) {
  try {
    await wishlistStore.receiveItem(id)
    telegramNotificationOccurred('success')
    await Promise.all([
      wishlistStore.fetchMyWishlist(),
      wishlistStore.fetchPartnerWishlist(),
      jointGiftStore.fetchAll(),
    ])
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
// TODO: логика для свайпа для возврата на страницу назад
// let touchStartX = 0
// let touchStartY = 0

// function onTouchStart(e: TouchEvent) {
//   touchStartX = e.touches[0].clientX
//   touchStartY = e.touches[0].clientY
// }

// function onTouchEnd(e: TouchEvent) {
//   const dx = e.changedTouches[0].clientX - touchStartX
//   const dy = Math.abs(e.changedTouches[0].clientY - touchStartY)
//   if (touchStartX < window.innerWidth * 0.25 && dx > 60 && dy < 80)
//     navigateTo('/')
// }

// onMounted(() => {
//   document.addEventListener('touchstart', onTouchStart, { passive: true })
//   document.addEventListener('touchend', onTouchEnd, { passive: true })
// })

// onUnmounted(() => {
//   document.removeEventListener('touchstart', onTouchStart)
//   document.removeEventListener('touchend', onTouchEnd)
// })
</script>

<template>
  <div>
    <BackButton @click="handleBackButton" />
    <div class="flex items-center justify-between animate-fade-in">
      <h1 class="text-2xl font-bold text-white">
        {{ t('wishlist.title') }}
      </h1>
      <div class="flex items-center gap-2 animate-fade-in">
        <UButton
          v-if="activeTab === 'mine'" class="animate-fade-in" size="lg" color="success" variant="subtle" leading-icon="i-lucide-plus"
          @click="isAddDrawerOpen = true"
        />
        <UButton
          v-else-if="activeTab === 'joint' && jointGiftStore.items.length > 0 && pairStore.isHost" class="animate-fade-in" size="lg"
          color="success" variant="subtle" leading-icon="i-lucide-plus" @click="isAddJointDrawerOpen = true"
        />
        <UDropdownMenu arrow :items="tabMenuItems" size="lg">
          <UButton
            size="lg" color="neutral" variant="subtle" :leading-icon="activeTabItem.icon"
            :label="activeTabItem.label" trailing-icon="i-lucide-chevron-down"
          />

          <!-- <template #item-trailing="{ item }">
            <UIcon v-if="item.active" name="i-lucide-check" class="shrink-0 size-4 text-primary" />
          </template> -->
        </UDropdownMenu>
      </div>
    </div>

    <MineTab
      v-if="activeTab === 'mine'" @add="isAddDrawerOpen = true" @delete="handleDelete"
      @receive="handleReceive"
    />
    <PartnerTab v-else-if="activeTab === 'partner'" @book="handleBook" @unbook="handleUnbook" />
    <JointTab
      v-else @add="isAddJointDrawerOpen = true" @contribute="handleContributeOpen"
      @complete="handleJointComplete" @delete="handleJointDelete"
    />

    <AddWishDrawer v-model:open="isAddDrawerOpen" :loading="isAddLoading" @submit="handleAdd" />
    <AddJointGiftDrawer
      v-if="pairStore.isHost" v-model:open="isAddJointDrawerOpen" :loading="isAddJointLoading"
      @submit="handleJointAdd"
    />
    <ContributeDrawer
      v-if="contributeTarget" v-model:open="isContributeOpen" :gift="contributeTarget.gift"
      :my-share="contributeTarget.myShare" :loading="isContributeLoading" @submit="handleContribute"
    />
  </div>
</template>
