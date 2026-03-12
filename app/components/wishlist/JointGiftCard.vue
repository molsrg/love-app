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
</script>

<template>
  <UCard variant="subtle" class="w-full">
    <div class="flex gap-3">
      <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-elevated flex items-center justify-center">
        <img v-if="gift.imageUrl" :src="gift.imageUrl" :alt="gift.title" class="w-full h-full object-cover">
        <UIcon v-else name="i-lucide-gift" class="text-primary size-8" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <p class="font-semibold text-white line-clamp-2">
            {{ gift.title }}
          </p>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <UButton
              v-if="gift.link" :href="gift.link" target="_blank" rel="noopener noreferrer" size="xs"
              color="neutral" variant="subtle" leading-icon="i-lucide-external-link"
            />
            <UBadge :label="formattedPrice" color="primary" variant="subtle" />
            <UBadge :label="t(`wishlist.joint.status.${gift.status}`)" :color="statusColor" variant="subtle" />
          </div>
        </div>
        <p v-if="gift.description" class="text-sm text-gray-400 line-clamp-2 mt-0.5">
          {{ gift.description }}
        </p>
      </div>
    </div>

    <div class="mt-3 space-y-2">
      <div>
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>{{ t('wishlist.joint.progress') }}</span>
          <span>{{ gift.progress }}%</span>
        </div>
        <UProgress :model-value="gift.progress" :max="100" color="primary" />
      </div>

      <div v-if="myShare" class="flex justify-between text-xs text-gray-400">
        <span>{{ t('wishlist.joint.myShare') }}</span>
        <span>{{ formatAmount(myShare.contributed) }} / {{ formatAmount(myShare.amount) }} ({{ myProgress }}%)</span>
      </div>

      <div v-if="partnerShare" class="flex justify-between text-xs text-gray-400">
        <span>{{ t('wishlist.joint.partnerShare') }}</span>
        <span>{{ formatAmount(partnerShare.contributed) }} / {{ formatAmount(partnerShare.amount) }} ({{ partnerProgress
        }}%)</span>
      </div>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-white/5 flex-wrap gap-2">
      <div class="flex items-center gap-2 ml-auto">
        <template v-if="gift.status === 'active'">
          <UButton
            v-if="myShare && myShare.contributed < myShare.amount" size="xs" color="primary" variant="subtle"
            leading-icon="i-lucide-wallet" :label="t('wishlist.joint.contribute')"
            @click="emit('contribute', gift.id)"
          />
          <UButton
            v-if="isHost" size="xs" color="error" variant="subtle" leading-icon="i-lucide-trash-2"
            :label="t('wishlist.joint.delete')" @click="handleDelete"
          />
        </template>

        <UButton
          v-if="gift.status === 'funded' && isHost" size="xs" color="success" variant="subtle"
          leading-icon="i-lucide-check-circle" :label="t('wishlist.joint.complete')" @click="handleComplete"
        />
      </div>
    </div>
  </UCard>
</template>
