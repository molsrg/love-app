<script lang="ts" setup>
import type { CreateWishlistItemRequest } from '~/utils/wishlist.api'

const emit = defineEmits<{
  submit: [data: CreateWishlistItemRequest]
}>()
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const title = ref('')
const description = ref('')
const link = ref('')
const titleError = ref('')

watch(open, (isOpen) => {
  if (!isOpen) {
    title.value = ''
    description.value = ''
    link.value = ''
    titleError.value = ''
  }
})

watch(title, () => {
  if (titleError.value && title.value.trim()) {
    titleError.value = ''
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
  if (link.value && !isValidUrl(link.value)) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    ...(description.value.trim() ? { description: description.value.trim() } : {}),
    ...(link.value.trim() ? { link: link.value.trim() } : {}),
  })
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #content>
      <div class="space-y-3">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.title') }}</label>
          <UInput
            v-model="title"
            :placeholder="t('wishlist.form.titlePlaceholder')"
            class="w-full"
            size="lg"
          />
          <UBadge v-if="titleError" class="mt-1 ml-1" color="error" :label="titleError" variant="outline" />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.description') }}</label>
          <UTextarea
            v-model="description"
            :placeholder="t('wishlist.form.descriptionPlaceholder')"
            class="w-full"
            size="lg"
            :rows="3"
            autoresize
          />
        </div>

        <div>
          <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.link') }}</label>
          <UInput
            v-model="link"
            :placeholder="t('wishlist.form.linkPlaceholder')"
            class="w-full"
            size="lg"
            trailing-icon="i-lucide-link"
          />
          <UBadge
            v-if="link && !isValidUrl(link)"
            class="mt-1 ml-1"
            color="error"
            :label="t('wishlist.form.errors.invalidUrl')"
            variant="outline"
          />
        </div>

        <div class="flex justify-end">
          <UButton
            :disabled="!title.trim() || (!!link && !isValidUrl(link))"
            :label="t('wishlist.form.submit')"
            color="primary"
            variant="subtle"
            leading-icon="i-lucide-plus"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>
