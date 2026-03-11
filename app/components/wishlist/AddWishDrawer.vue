<script lang="ts" setup>
import type { CreateWishlistItemRequest } from '~/utils/wishlist.api'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: CreateWishlistItemRequest]
}>()
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const title = ref('')
const description = ref('')
const link = ref('')
const titleError = ref('')
const linkError = ref('')

watch(open, (isOpen) => {
  if (!isOpen) {
    title.value = ''
    description.value = ''
    link.value = ''
    titleError.value = ''
    linkError.value = ''
  }
})

watch(title, () => {
  if (titleError.value && title.value.trim()) {
    titleError.value = ''
  }
})

watch(link, () => {
  if (linkError.value && link.value.trim()) {
    linkError.value = ''
  }
})

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  }
  catch {
    return false
  }
}

function handleSubmit() {
  if (!title.value.trim()) {
    titleError.value = t('wishlist.form.errors.titleRequired')
    return
  }
  if (!link.value.trim()) {
    linkError.value = t('wishlist.form.errors.linkRequired')
    return
  }
  if (!isValidUrl(link.value)) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    ...(description.value.trim() ? { description: description.value.trim() } : {}),
    link: link.value.trim(),
  })
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #content>
      <div class="space-y-3 pb-3">
        <UFormField
          :label="t('wishlist.form.title')"
          :error="titleError"
          required
        >
          <UInput
            v-model="title"
            :placeholder="t('wishlist.form.titlePlaceholder')"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :label="t('wishlist.form.description')">
          <UTextarea
            v-model="description"
            :placeholder="t('wishlist.form.descriptionPlaceholder')"
            class="w-full"
            size="lg"
            :rows="3"
            autoresize
          />
        </UFormField>

        <UFormField
          :label="t('wishlist.form.link')"
          :error="linkError || (link && !isValidUrl(link) ? t('wishlist.form.errors.invalidUrl') : '')"
          required
        >
          <UInput
            v-model="link"
            :placeholder="t('wishlist.form.linkPlaceholder')"
            class="w-full"
            size="lg"
            trailing-icon="i-lucide-link"
          />
        </UFormField>

        <div class="flex justify-end mt-4">
          <UButton
            :disabled="!title.trim() || !link.trim() || (!!link && !isValidUrl(link))"
            :loading="props.loading"
            :label="t('wishlist.form.submit')"
            color="primary"
            variant="subtle"
            leading-icon="i-lucide-plus"
            size="lg"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
