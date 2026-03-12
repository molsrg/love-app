<script lang="ts" setup>
const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: FormData]
}>()

const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const title = ref('')
const description = ref('')
const link = ref('')
const price = ref<number | undefined>(1000)
const partnerPercent = ref<number | undefined>(50)
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)

const titleError = ref('')
const priceError = ref('')
const partnerPercentError = ref('')
const linkError = ref('')

watch(imageFile, (newFile) => {
  if (imagePreviewUrl.value)
    URL.revokeObjectURL(imagePreviewUrl.value)
  imagePreviewUrl.value = newFile ? URL.createObjectURL(newFile) : null
})

watch(open, (isOpen) => {
  if (!isOpen) {
    title.value = ''
    description.value = ''
    link.value = ''
    price.value = 1000
    partnerPercent.value = 50
    imageFile.value = null
    titleError.value = ''
    priceError.value = ''
    partnerPercentError.value = ''
    linkError.value = ''
  }
})

watch(title, () => {
  if (titleError.value && title.value.trim())
    titleError.value = ''
})

watch(price, () => {
  if (priceError.value && price.value && price.value > 0)
    priceError.value = ''
})

watch(partnerPercent, () => {
  if (
    partnerPercentError.value
    && partnerPercent.value
    && partnerPercent.value >= 1
    && partnerPercent.value <= 99
  ) {
    partnerPercentError.value = ''
  }
})

watch(link, () => {
  if (linkError.value && link.value.trim())
    linkError.value = ''
})

const myPercent = computed(() =>
  partnerPercent.value ? 100 - partnerPercent.value : undefined,
)
const myAmount = computed(() =>
  price.value && myPercent.value
    ? Math.round((price.value * myPercent.value) / 100)
    : undefined,
)
const partnerAmount = computed(() =>
  price.value && partnerPercent.value
    ? Math.round((price.value * partnerPercent.value) / 100)
    : undefined,
)

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  }
  catch {
    return false
  }
}

const isSubmitDisabled = computed(() => {
  return (
    !title.value.trim()
    || !price.value
    || price.value <= 0
    || !partnerPercent.value
    || partnerPercent.value < 1
    || partnerPercent.value > 99
    || (!!link.value && !isValidUrl(link.value))
  )
})

function handleSubmit() {
  let hasError = false

  if (!title.value.trim()) {
    titleError.value = t('wishlist.joint.form.errors.titleRequired')
    hasError = true
  }
  if (!price.value || price.value <= 0) {
    priceError.value = !price.value
      ? t('wishlist.joint.form.errors.priceRequired')
      : t('wishlist.joint.form.errors.priceInvalid')
    hasError = true
  }
  if (
    !partnerPercent.value
    || partnerPercent.value < 1
    || partnerPercent.value > 99
  ) {
    partnerPercentError.value = !partnerPercent.value
      ? t('wishlist.joint.form.errors.partnerPercentRequired')
      : t('wishlist.joint.form.errors.partnerPercentInvalid')
    hasError = true
  }
  if (link.value && !isValidUrl(link.value)) {
    linkError.value = t('wishlist.form.errors.invalidUrl')
    hasError = true
  }

  if (hasError)
    return

  const formData = new FormData()
  formData.append('title', title.value.trim())
  if (description.value.trim())
    formData.append('description', description.value.trim())
  if (link.value.trim())
    formData.append('link', link.value.trim())
  formData.append('price', String(price.value))
  formData.append('partnerPercent', String(partnerPercent.value))
  if (imageFile.value)
    formData.append('image', imageFile.value)

  emit('submit', formData)
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #body>
      <div class="space-y-2 pb-1 overflow-y-auto">
        <div class="flex items-center gap-2">
          <UFormField :label="t('wishlist.joint.form.title')" :error="titleError || undefined" required class="w-full">
            <UInput v-model="title" :placeholder="t('wishlist.joint.form.titlePlaceholder')" class="w-full" size="lg" />
          </UFormField>
          <UFileUpload v-slot="{ open: openFile }" v-model="imageFile" accept="image/*" class="mr-1 mt-6">
            <button type="button" class="relative block cursor-pointer" @click="openFile()">
              <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="size-9 rounded-md object-cover" alt="">
              <div v-else class="size-9 rounded-md bg-elevated flex items-center justify-center ring-1 ring-muted">
                <UIcon name="i-lucide-image-plus" class="text-muted size-5" />
              </div>
            </button>
          </UFileUpload>
        </div>

        <UFormField :label="t('wishlist.joint.form.description')">
          <UTextarea
            v-model="description" :placeholder="t('wishlist.joint.form.descriptionPlaceholder')" class="w-full"
            size="lg" :rows="2" autoresize
          />
        </UFormField>

        <UFormField
          required :label="t('wishlist.joint.form.link')" :error="linkError
            || (link && !isValidUrl(link)
              ? t('wishlist.form.errors.invalidUrl')
              : undefined)
            || undefined
          "
        >
          <UInput
            v-model="link" :placeholder="t('wishlist.joint.form.linkPlaceholder')" class="w-full" size="lg"
            trailing-icon="i-lucide-link"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-3">
          <UFormField required :label="t('wishlist.joint.form.price')" :error="priceError || undefined">
            <UInputNumber
              v-model="price" :placeholder="t('wishlist.joint.form.pricePlaceholder')" class="w-full"
              size="lg" :min="100" :step="50" :step-snapping="false" readonly
            />
          </UFormField>

          <UFormField
            required :label="t('wishlist.joint.form.partnerPercent')"
            :error="partnerPercentError || undefined"
          >
            <UInputNumber v-model="partnerPercent" class="w-full" size="lg" :min="1" :max="99" readonly />
          </UFormField>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="delta in [500, 1000, 5000]" :key="`add-${delta}`" :label="`+${delta}`" size="xs"
            color="primary" variant="subtle" @click="price = Math.max(100, (price ?? 0) + delta)"
          />
          <UButton
            v-for="delta in [500, 1000, 5000]" :key="`sub-${delta}`" :label="`-${delta}`" size="xs"
            color="neutral" variant="subtle" @click="price = Math.max(100, (price ?? 0) - delta)"
          />
        </div>

        <UCollapsible class="group">
          <UButton
            color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-chevron-down"
            :label="t('wishlist.joint.form.sharesPreview')"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform' }"
          />
          <template #content>
            <div
              v-if="price && partnerPercent && partnerPercent >= 1 && partnerPercent <= 99"
              class="rounded-lg bg-elevated p-3 space-y-1.5 text-sm mt-2"
            >
              <div class="flex justify-between text-white">
                <span>{{ t("wishlist.joint.myShare") }} ({{ myPercent }}%)</span>
                <span class="text-primary font-medium">{{ myAmount?.toLocaleString("ru-RU") }} ₽</span>
              </div>
              <div class="flex justify-between text-white">
                <span>{{ t("wishlist.joint.partnerShare") }} ({{ partnerPercent }}%)</span>
                <span class="text-primary font-medium">{{ partnerAmount?.toLocaleString("ru-RU") }} ₽</span>
              </div>
            </div>
          </template>
        </UCollapsible>

        <div class="flex justify-end mt-4">
          <UButton
            :disabled="isSubmitDisabled" :loading="props.loading" :label="t('wishlist.joint.form.submit')"
            color="primary" variant="subtle" leading-icon="i-lucide-plus" size="lg" @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
