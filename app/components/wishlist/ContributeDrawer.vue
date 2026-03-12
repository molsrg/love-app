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

const presets = [100, 300, 500, 1000]
const availablePresets = computed(() => presets.filter(p => p <= remaining.value))

watch(open, (isOpen) => {
  if (!isOpen) {
    amount.value = undefined
    amountError.value = ''
    amount.value = 200
  }
})

watch(amount, () => {
  if (amountError.value && amount.value && amount.value >= 1 && amount.value <= remaining.value)
    amountError.value = ''
})

function handleSubmit() {
  if (!amount.value || amount.value < 1) {
    amountError.value = t('wishlist.joint.contributeForm.errors.amountRequired')
    return
  }
  if (amount.value > remaining.value) {
    amountError.value = t('wishlist.joint.contributeForm.errors.amountInvalid', { max: remaining.value })
    return
  }
  emit('submit', amount.value)
}
</script>

<template>
  <UDrawer v-model:open="open" :title="t('wishlist.joint.contributeForm.title')">
    <template #body>
      <div class="space-y-3 pb-3 overflow-y-auto max-h-[70vh]">
        <UFormField
          :label="t('wishlist.joint.contributeForm.amount')"
          :error="amountError"
        >
          <template #hint>
            <UBadge
              :label="t('wishlist.joint.contributeForm.remaining', { amount: remaining.toLocaleString('ru-RU') })"
              color="neutral"
              variant="subtle"
              size="xs"
            />
          </template>
          <UInputNumber
            v-model="amount"
            class="w-full"
            size="lg"
            :min="1"
            :max="remaining"
            :format-options="{ style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }"
          />
        </UFormField>

        <div v-if="availablePresets.length > 0" class="flex flex-wrap gap-2">
          <UButton
            v-for="preset in availablePresets"
            :key="preset"
            size="sm"
            color="neutral"
            :variant="amount === preset ? 'solid' : 'subtle'"
            :label="`${preset.toLocaleString('ru-RU')} ₽`"
            @click="amount = preset"
          />
        </div>

        <div class="flex justify-end mt-4">
          <UButton
            :disabled="!amount || amount < 1 || amount > remaining"
            :loading="props.loading"
            :label="t('wishlist.joint.contributeForm.submit')"
            color="primary"
            variant="subtle"
            leading-icon="i-lucide-wallet"
            size="lg"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
