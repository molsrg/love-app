<script lang="ts" setup>
import type { CreateWishlistItemRequest } from '~/utils/wishlist.api'

const emit = defineEmits<{
  submit: [data: CreateWishlistItemRequest]
}>()
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const form = reactive<CreateWishlistItemRequest>({
  title: '',
  description: undefined,
  link: undefined,
  imageUrl: undefined,
  price: undefined,
})

const titleError = ref('')

watch(open, (isOpen) => {
  if (!isOpen) {
    form.title = ''
    form.description = undefined
    form.link = undefined
    form.imageUrl = undefined
    form.price = undefined
    titleError.value = ''
  }
})

function validate(): boolean {
  if (!form.title.trim()) {
    titleError.value = t('wishlist.form.errors.titleRequired')
    return false
  }
  titleError.value = ''
  return true
}

watch(() => form.title, () => {
  if (titleError.value)
    validate()
})

function handleSubmit() {
  if (!validate())
    return

  const data: CreateWishlistItemRequest = {
    title: form.title.trim(),
    ...(form.description?.trim() ? { description: form.description.trim() } : {}),
    ...(form.link?.trim() ? { link: form.link.trim() } : {}),
    ...(form.imageUrl?.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
    ...(form.price != null ? { price: form.price } : {}),
  }

  emit('submit', data)
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #content>
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-white">
          {{ t('wishlist.add') }}
        </h3>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.title') }} *</label>
          <UInput
            v-model="form.title"
            :placeholder="t('wishlist.form.titlePlaceholder')"
            class="w-full"
            size="lg"
          />
          <UBadge v-if="titleError" class="mt-1 ml-1" color="error" :label="titleError" variant="outline" />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.description') }}</label>
          <UTextarea
            v-model="form.description"
            :placeholder="t('wishlist.form.descriptionPlaceholder')"
            class="w-full"
            :rows="2"
            autoresize
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.price') }}</label>
          <UInput
            v-model.number="form.price"
            type="number"
            :placeholder="t('wishlist.form.pricePlaceholder')"
            class="w-full"
            size="lg"
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.link') }}</label>
          <UInput
            v-model="form.link"
            type="url"
            :placeholder="t('wishlist.form.linkPlaceholder')"
            class="w-full"
            size="lg"
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.imageUrl') }}</label>
          <UInput
            v-model="form.imageUrl"
            type="url"
            :placeholder="t('wishlist.form.imageUrlPlaceholder')"
            class="w-full"
            size="lg"
          />
        </div>

        <div class="flex justify-end pt-1">
          <UButton
            color="primary"
            variant="subtle"
            :label="t('wishlist.form.submit')"
            leading-icon="i-lucide-plus"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
