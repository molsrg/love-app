<script lang="ts" setup>
import type { JointGiftResponse } from '~/utils/joint-gift.api'

const props = defineProps<{
  gift: JointGiftResponse
}>()

const emit = defineEmits<{
  contribute: [id: string]
  complete: [id: string]
  delete: [id: string]
}>()

const { t } = useI18n()
const pairStore = usePairStore()

const isHost = computed(() => props.gift.createdById === pairStore.user1.id)

const myShare = computed(() => props.gift.shares.find(s => s.userId === pairStore.user1.id))
const partnerShare = computed(() => props.gift.shares.find(s => s.userId !== pairStore.user1.id))

const myProgress = computed(() => {
  if (!myShare.value || myShare.value.amount === 0)
    return 0
  return Math.floor((myShare.value.contributed / myShare.value.amount) * 100)
})

const partnerProgress = computed(() => {
  if (!partnerShare.value || partnerShare.value.amount === 0)
    return 0
  return Math.floor((partnerShare.value.contributed / partnerShare.value.amount) * 100)
})

const formattedPrice = computed(() =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(props.gift.price),
)

const daysSinceCreated = computed(() => {
  const diff = Date.now() - new Date(props.gift.createdAt).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

const statusColor = computed(() => {
  if (props.gift.status === 'funded')
    return 'success'
  if (props.gift.status === 'completed')
    return 'neutral'
  return 'primary'
})

function handleDelete() {
  if (!confirm(t('wishlist.joint.confirmDelete')))
    return
  emit('delete', props.gift.id)
}

function handleComplete() {
  if (!confirm(t('wishlist.joint.confirmComplete')))
    return
  emit('complete', props.gift.id)
}

const isImageOpen = ref(false)
</script>

<template>
  <UCard variant="subtle">
    <!-- <template #header>
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <UBadge :label="formattedPrice" color="primary" variant="subtle" />
        <UBadge :label="t(`wishlist.joint.status.${gift.status}`)" :color="statusColor" variant="subtle" />
      </div>
    </template> -->
    <header class="flex gap-2">
      <div
        class="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-elevated flex ring-1 ring-accented items-center justify-center"
        :class="{ 'cursor-zoom-in': gift.imageUrl }" @click="gift.imageUrl && (isImageOpen = true)">
        <img v-if="gift.imageUrl" :src="gift.imageUrl" :alt="gift.title" class="w-full h-full object-cover">

        <UIcon v-else name="i-lucide-gift" class="text-primary size-8" />

        <div v-if="gift.imageUrl" class="absolute top-0 right-0.5 rounded">
          <UIcon name="i-lucide-zoom-in" class="size-3.5 text-white" />
        </div>
      </div>

      <div class="flex flex-col gap-0.5 flex-1 min-w-0">
        <p class="font-bold line-clamp-2">
          {{ gift.title }}
        </p>

        <p v-if="gift.description" class="text-sm text-muted line-clamp-2">
          {{ gift.description }}
        </p>
      </div>
    </header>

    <UModal v-if="gift.imageUrl" v-model:open="isImageOpen"
      :ui="{ content: 'bg-transparent shadow-none p-0 max-w-screen-sm' }">
      <template #content>
        <img :src="gift.imageUrl" :alt="gift.title" class="w-full rounded-lg object-contain max-h-[80vh]"
          @click="isImageOpen = false">
      </template>
    </UModal>

    <div class="mt-2 flex flex-col gap-2">
      <div>
        <div class="flex justify-between text-xs font-medium mb-1">
          <span>{{ t('wishlist.joint.progress') }}</span>
          <span>{{ gift.progress }}%</span>
        </div>
        <ProgressBar :percent="gift.progress / 100" />
      </div>

      <div v-if="myShare" class="flex justify-between text-xs text-muted">
        <span>{{ t('wishlist.joint.myShare') }} ({{ myShare.percent }}%)</span>
        <span>{{ formatAmount(myShare.contributed) }} / {{ formatAmount(myShare.amount) }} ({{ myProgress }}%)</span>
      </div>

      <div v-if="partnerShare" class="flex justify-between text-xs text-muted ">
        <span>{{ t('wishlist.joint.partnerShare') }} ({{ partnerShare.percent }}%)</span>
        <span>{{ formatAmount(partnerShare.contributed) }} / {{ formatAmount(partnerShare.amount) }} ({{ partnerProgress
          }}%)</span>
      </div>

      <div class="flex items-center gap-1 text-xs text-muted">
        <UIcon name="i-lucide-clock" class="size-3" />
        <span>{{ t('wishlist.joint.savingDays', { count: daysSinceCreated || 1 }) }}</span>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <UButton v-if="gift.link" :href="gift.link" target="_blank" :label="t('wishlist.actions.openLink')"
          rel="noopener noreferrer" size="xs" color="neutral" variant="subtle" leading-icon="i-lucide-external-link" />
        <div class="flex items-center gap-2 ml-auto">
          <template v-if="gift.status === 'active'">
            <UButton v-if="myShare && myShare.contributed < myShare.amount" size="xs" color="success" variant="subtle"
              leading-icon="i-lucide-wallet" :label="t('wishlist.joint.contribute')"
              @click="emit('contribute', gift.id)" />
            <UButton v-if="isHost" size="xs" color="error" variant="subtle" leading-icon="i-lucide-trash-2"
              :label="t('wishlist.joint.delete')" @click="handleDelete" />
          </template>

          <UButton v-if="gift.status === 'funded' && isHost" size="xs" color="success" variant="subtle"
            leading-icon="i-lucide-check-circle" :label="t('wishlist.joint.complete')" @click="handleComplete" />
        </div>
      </div>
    </template>
  </UCard>
</template>
