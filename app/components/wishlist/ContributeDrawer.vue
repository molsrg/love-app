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

const amount = ref<number | undefined>(200)
const amountError = ref('')

const remaining = computed(() => props.myShare.amount - props.myShare.contributed)

watch(open, (isOpen) => {
  if (!isOpen) {
    amount.value = 200
    amountError.value = ''
  }
})

watch(amount, () => {
  if (
    amountError.value
    && amount.value
    && amount.value >= 1
    && amount.value <= remaining.value
  ) {
    amountError.value = ''
  }
})

function changeAmount(delta: number) {
  amount.value = Math.min(
    remaining.value,
    Math.max(100, (amount.value ?? 100) + delta),
  )
}

const isSubmitDisabled = computed(() => {
  return !amount.value || amount.value < 1 || amount.value > remaining.value
})

function handleSubmit() {
  if (!amount.value || amount.value < 1) {
    amountError.value = t('wishlist.joint.contributeForm.errors.amountRequired')
    return
  }

  if (amount.value > remaining.value) {
    amountError.value = t('wishlist.joint.contributeForm.errors.amountInvalid', {
      max: remaining.value,
    })
    return
  }

  emit('submit', amount.value)
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #body>
      <div class="space-y-2 pb-1 overflow-y-auto mt-4">
        <UFormField :label="t('wishlist.joint.contributeForm.amount')" :error="amountError || undefined">
          <template #hint>
            <UBadge
              :label="t('wishlist.joint.contributeForm.remaining', {
                amount: remaining.toLocaleString('ru-RU'),
              })" color="neutral" variant="subtle" size="md"
            />
          </template>
          <div class="flex items-cemter" />
          <UInputNumber
            v-model="amount" class="w-full" size="lg" :min="100" :step="10" :step-snapping="false" readonly
            :max="remaining" :format-options="{
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            }"
          />
        </UFormField>

        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="delta in [100, 300, 500]" :key="`add-${delta}`" :label="`+${delta}`" size="xs" color="primary"
            variant="subtle" @click="changeAmount(delta)"
          />

          <UButton
            v-for="delta in [100, 300, 500]" :key="`sub-${delta}`" :label="`-${delta}`" size="xs" color="neutral"
            variant="subtle" @click="changeAmount(-delta)"
          />
        </div>

        <div class="flex justify-end mt-4">
          <UButton
            :disabled="isSubmitDisabled" :loading="props.loading"
            :label="t('wishlist.joint.contributeForm.submit')" color="primary" variant="subtle"
            leading-icon="i-lucide-wallet" size="lg" @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
