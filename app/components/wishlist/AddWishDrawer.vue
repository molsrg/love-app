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
const titleError = ref('')
const linkError = ref('')
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)

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
    titleError.value = ''
    linkError.value = ''
    imageFile.value = null
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

  const formData = new FormData()
  formData.append('title', title.value.trim())
  if (description.value.trim())
    formData.append('description', description.value.trim())
  formData.append('link', link.value.trim())
  if (imageFile.value)
    formData.append('image', imageFile.value)

  emit('submit', formData)
}
</script>

<template>
  <UDrawer v-model:open="open" :title="t('wishlist.add')">
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

        <UFormField
          :label="t('wishlist.form.image')"
        >
          <UFileUpload v-slot="{ open, removeFile }" v-model="imageFile" accept="image/*">
            <div class="flex flex-wrap items-center gap-3">
              <img
                v-if="imagePreviewUrl"
                :src="imagePreviewUrl"
                class="size-8 rounded-lg object-cover"
                alt=""
              >
              <UIcon v-else name="i-lucide-image" class="text-muted size-8" />

              <UButton
                :label="imageFile ? t('wishlist.form.imageChange') : t('wishlist.form.imageSelect')"
                color="neutral"
                variant="subtle"
                @click="open()"
              />
            </div>

            <p v-if="imageFile" class="text-xs text-muted mt-1.5">
              {{ imageFile.name }}
              <UButton
                :label="t('wishlist.form.imageRemove')"
                color="error"
                variant="link"
                size="xs"
                class="p-0"
                @click="removeFile()"
              />
            </p>
          </UFileUpload>
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
