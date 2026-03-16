<script lang="ts" setup>
import type { JointGiftResponse, Share } from '~/utils/joint-gift.api'

const props = defineProps<{
  gift: JointGiftResponse
  myShare: Share
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [amount: number]
}>()

const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const MIN_AMOUNT = 200

const remaining = computed(() => props.myShare.amount - props.myShare.contributed)
const amount = ref<number | undefined>(200)
const amountError = ref('')

const progressAfter = computed(() =>
  Math.min(100, Math.round(((props.myShare.contributed + (amount.value ?? 0)) / props.myShare.amount) * 100)),
)
const remainingAfter = computed(() => Math.max(0, remaining.value - (amount.value ?? 0)))
const contributedAfter = computed(() => props.myShare.contributed + (amount.value ?? 0))

watch(open, (isOpen) => {
  if (isOpen) {
    amount.value = MIN_AMOUNT
    amountError.value = ''
  }
})

watch(amount, () => {
  if (amountError.value && amount.value && amount.value >= MIN_AMOUNT && amount.value <= remaining.value)
    amountError.value = ''
})

function changeAmount(delta: number) {
  amount.value = Math.min(remaining.value, Math.max(MIN_AMOUNT, (amount.value ?? MIN_AMOUNT) + delta))
}

const isSubmitDisabled = computed(() => !amount.value || amount.value < MIN_AMOUNT || amount.value > remaining.value)

function handleSubmit() {
  emit('submit', amount.value)
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #body>
      <div class="flex flex-col gap-4 px-1 pt-1 pb-2">
        <!-- Gift header -->
        <div class="flex items-center gap-3">
          <img v-if="gift.imageUrl" :src="gift.imageUrl" class="size-12 rounded-xl object-cover shrink-0">
          <div v-else class="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-gift" class="size-6 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              {{ gift.title }}
            </p>
            <p class="text-sm text-muted">
              {{ gift.price.toLocaleString('ru-RU') }} ₽
            </p>
          </div>
        </div>

        <!-- My share card with live progress -->
        <UCard variant="subtle">
          <div class="space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted">{{ t('wishlist.joint.contributeForm.myShare') }}</span>
              <span class="font-medium">{{ myShare.amount.toLocaleString('ru-RU') }} ₽</span>
            </div>
            <ProgressBar :percent="progressAfter / 100" />
            <div class="flex justify-between text-xs">
              <span class="text-muted">
                {{ t('wishlist.joint.contributeForm.contributed') }}:
                <span class="text-highlighted font-medium transition-all duration-200">
                  {{ contributedAfter.toLocaleString('ru-RU') }} ₽
                </span>
              </span>
              <span :class="remainingAfter === 0 ? 'text-success font-medium' : 'text-muted'">
                {{ remainingAfter === 0
                  ? t('wishlist.joint.contributeForm.fullyFunded')
                  : `${t('wishlist.joint.contributeForm.remainingAfter')}: ${remainingAfter.toLocaleString('ru-RU')} ₽`
                }}
              </span>
            </div>
          </div>
        </UCard>

        <!-- Amount input -->
        <UFormField :label="t('wishlist.joint.contributeForm.amount')" :error="amountError || undefined">
          <UInputNumber
            v-model="amount" class="w-full" size="lg" :min="MIN_AMOUNT" :step="10" :step-snapping="false"
            readonly :max="remaining" :format-options="{
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            }"
          />
        </UFormField>

        <!-- Delta buttons -->
        <div class="grid grid-cols-3 gap-2">
          <UButton
            v-for="delta in [500, 1000, 5000]" :key="`add-${delta}`" :label="`+${delta.toLocaleString('ru-RU')}`"
            size="sm" color="primary" variant="subtle" class="w-full" @click="changeAmount(delta)"
          />
          <UButton
            v-for="delta in [500, 1000, 5000]" :key="`sub-${delta}`" :label="`−${delta.toLocaleString('ru-RU')}`"
            size="sm" color="neutral" variant="subtle" class="w-full" @click="changeAmount(-delta)"
          />
        </div>

        <!-- Submit -->
        <UButton
          block :disabled="isSubmitDisabled" :loading="props.loading"
          :label="t('wishlist.joint.contributeForm.submit')" color="primary" variant="subtle"
          leading-icon="i-lucide-wallet" size="lg" @click="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>
