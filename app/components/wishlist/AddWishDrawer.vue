<script lang="ts" setup>
import type { CreateWishlistItemRequest } from '~/utils/wishlist.api'

const emit = defineEmits<{
  submit: [data: CreateWishlistItemRequest]
}>()
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()

const link = ref('')
const title = ref('')
const price = ref<number | undefined>()
const linkError = ref('')
const isPasted = ref(false)

watch(open, (isOpen) => {
  if (!isOpen) {
    link.value = ''
    title.value = ''
    price.value = undefined
    linkError.value = ''
    isPasted.value = false
  }
})

function mockTitleFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(p => p.length > 1)
    const last = parts[parts.length - 1]
    if (last) {
      return last
        .replace(/[-_]/g, ' ')
        .replace(/\.[^.]+$/, '')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim()
    }
    return u.hostname.replace('www.', '')
  }
  catch {
    return ''
  }
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  }
  catch {
    return false
  }
}

async function handlePaste() {
  linkError.value = ''
  try {
    const text = (await navigator.clipboard.readText()).trim()
    if (!text) {
      linkError.value = t('wishlist.form.errors.clipboardEmpty')
      return
    }
    if (!isValidUrl(text)) {
      linkError.value = t('wishlist.form.errors.invalidUrl')
      return
    }
    link.value = text
    title.value = mockTitleFromUrl(text)
    isPasted.value = true
  }
  catch {
    linkError.value = t('wishlist.form.errors.clipboardError')
  }
}

function handleSubmit() {
  if (!title.value.trim())
    return

  emit('submit', {
    title: title.value.trim(),
    link: link.value || undefined,
    ...(price.value != null ? { price: price.value } : {}),
  })
}
</script>

<template>
  <UDrawer v-model:open="open">
    <template #content>
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-white">
          {{ t('wishlist.add') }}
        </h3>

        <template v-if="!isPasted">
          <UButton
            color="primary"
            variant="subtle"
            leading-icon="i-lucide-clipboard"
            :label="t('wishlist.form.paste')"
            class="w-full h-[44px]"
            @click="handlePaste"
          />
          <UBadge v-if="linkError" class="ml-1" color="error" :label="linkError" variant="outline" />
        </template>

        <template v-else>
          <div>
            <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.link') }}</label>
            <UInput
              v-model="link"
              disabled
              class="w-full"
              size="lg"
              trailing-icon="i-lucide-link"
            />
          </div>

          <div>
            <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.title') }}</label>
            <UInput
              v-model="title"
              :placeholder="t('wishlist.form.titlePlaceholder')"
              class="w-full"
              size="lg"
            />
          </div>

          <div>
            <label class="text-sm text-gray-400 mb-1 block">{{ t('wishlist.form.price') }}</label>
            <UInput
              v-model.number="price"
              type="number"
              :placeholder="t('wishlist.form.pricePlaceholder')"
              class="w-full"
              size="lg"
            />
          </div>

          <div class="flex gap-2 justify-between">
            <UButton
              color="neutral"
              variant="ghost"
              leading-icon="i-lucide-arrow-left"
              :label="t('wishlist.form.back')"
              @click="isPasted = false"
            />
            <UButton
              color="primary"
              variant="subtle"
              :disabled="!title.trim()"
              leading-icon="i-lucide-plus"
              :label="t('wishlist.form.submit')"
              @click="handleSubmit"
            />
          </div>
        </template>
      </div>
    </template>
  </UDrawer>
</template>
