<script lang="ts" setup>
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: FormData];
}>();

const open = defineModel<boolean>("open", { required: true });
const { t } = useI18n();

const title = ref("");
const description = ref("");
const link = ref("");
const price = ref<number | undefined>(undefined);
const partnerPercent = ref<number | undefined>(50);
const imageFile = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);

const titleError = ref("");
const priceError = ref("");
const partnerPercentError = ref("");
const linkError = ref("");

watch(imageFile, (newFile) => {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);
  imagePreviewUrl.value = newFile ? URL.createObjectURL(newFile) : null;
});

watch(open, (isOpen) => {
  if (!isOpen) {
    title.value = "";
    description.value = "";
    link.value = "";
    price.value = undefined;
    partnerPercent.value = 50;
    imageFile.value = null;
    titleError.value = "";
    priceError.value = "";
    partnerPercentError.value = "";
    linkError.value = "";
  }
});

watch(title, () => {
  if (titleError.value && title.value.trim()) titleError.value = "";
});

watch(price, () => {
  if (priceError.value && price.value && price.value > 0) priceError.value = "";
});

watch(partnerPercent, () => {
  if (
    partnerPercentError.value &&
    partnerPercent.value &&
    partnerPercent.value >= 1 &&
    partnerPercent.value <= 99
  )
    partnerPercentError.value = "";
});

watch(link, () => {
  if (linkError.value && link.value.trim()) linkError.value = "";
});

const myPercent = computed(() =>
  partnerPercent.value ? 100 - partnerPercent.value : undefined,
);
const myAmount = computed(() =>
  price.value && myPercent.value
    ? Math.round((price.value * myPercent.value) / 100)
    : undefined,
);
const partnerAmount = computed(() =>
  price.value && partnerPercent.value
    ? Math.round((price.value * partnerPercent.value) / 100)
    : undefined,
);

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const isSubmitDisabled = computed(() => {
  return (
    !title.value.trim() ||
    !price.value ||
    price.value <= 0 ||
    !partnerPercent.value ||
    partnerPercent.value < 1 ||
    partnerPercent.value > 99 ||
    (!!link.value && !isValidUrl(link.value))
  );
});

function handleSubmit() {
  let hasError = false;

  if (!title.value.trim()) {
    titleError.value = t("wishlist.joint.form.errors.titleRequired");
    hasError = true;
  }
  if (!price.value || price.value <= 0) {
    priceError.value = !price.value
      ? t("wishlist.joint.form.errors.priceRequired")
      : t("wishlist.joint.form.errors.priceInvalid");
    hasError = true;
  }
  if (
    !partnerPercent.value ||
    partnerPercent.value < 1 ||
    partnerPercent.value > 99
  ) {
    partnerPercentError.value = !partnerPercent.value
      ? t("wishlist.joint.form.errors.partnerPercentRequired")
      : t("wishlist.joint.form.errors.partnerPercentInvalid");
    hasError = true;
  }
  if (link.value && !isValidUrl(link.value)) {
    linkError.value = t("wishlist.form.errors.invalidUrl");
    hasError = true;
  }

  if (hasError) return;

  const formData = new FormData();
  formData.append("title", title.value.trim());
  if (description.value.trim())
    formData.append("description", description.value.trim());
  if (link.value.trim()) formData.append("link", link.value.trim());
  formData.append("price", String(price.value));
  formData.append("partnerPercent", String(partnerPercent.value));
  if (imageFile.value) formData.append("image", imageFile.value);

  emit("submit", formData);
}
</script>

<template>
  <UDrawer v-model:open="open" :title="t('wishlist.joint.add')">
    <template #body>
      <div class="space-y-3 pb-3 overflow-y-auto max-h-[70vh]">
        <UFormField
          :label="t('wishlist.joint.form.title')"
          :error="titleError"
        >
          <UInput
            v-model="title"
            :placeholder="t('wishlist.joint.form.titlePlaceholder')"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField :label="t('wishlist.joint.form.description')">
          <UTextarea
            v-model="description"
            :placeholder="t('wishlist.joint.form.descriptionPlaceholder')"
            class="w-full"
            size="lg"
            :rows="2"
            autoresize
          />
        </UFormField>

        <UFormField
          :label="t('wishlist.joint.form.link')"
          :error="
            linkError ||
            (link && !isValidUrl(link)
              ? t('wishlist.form.errors.invalidUrl')
              : '')
          "
        >
          <UInput
            v-model="link"
            :placeholder="t('wishlist.joint.form.linkPlaceholder')"
            class="w-full"
            size="lg"
            trailing-icon="i-lucide-link"
          />
        </UFormField>

        <UFormField
          :label="t('wishlist.joint.form.price')"
          :error="priceError"
        >
          <UInputNumber
            v-model="price"
            :placeholder="t('wishlist.joint.form.pricePlaceholder')"
            class="w-full"
            size="lg"
            :min="1"
          />
        </UFormField>

        <UFormField
          :label="t('wishlist.joint.form.partnerPercent')"
          :error="partnerPercentError"
        >
          <UInputNumber
            v-model="partnerPercent"
            class="w-full"
            size="lg"
            :min="1"
            :max="99"
          />
        </UFormField>

        <div
          v-if="
            price &&
            partnerPercent &&
            partnerPercent >= 1 &&
            partnerPercent <= 99
          "
          class="rounded-lg bg-elevated p-3 space-y-1.5 text-sm"
        >
          <p class="text-xs text-gray-400 mb-1">
            {{ t("wishlist.joint.form.sharesPreview") }}
          </p>
          <div class="flex justify-between text-white">
            <span>{{ t("wishlist.joint.myShare") }} ({{ myPercent }}%)</span>
            <span class="text-primary font-medium"
              >{{ myAmount?.toLocaleString("ru-RU") }} ₽</span
            >
          </div>
          <div class="flex justify-between text-white">
            <span
              >{{ t("wishlist.joint.partnerShare") }} ({{
                partnerPercent
              }}%)</span
            >
            <span class="text-primary font-medium"
              >{{ partnerAmount?.toLocaleString("ru-RU") }} ₽</span
            >
          </div>
        </div>

        <UFormField :label="t('wishlist.joint.form.image')">
          <UFileUpload
            v-slot="{ open: openFile, removeFile }"
            v-model="imageFile"
            accept="image/*"
          >
            <div class="flex flex-wrap items-center gap-3">
              <img
                v-if="imagePreviewUrl"
                :src="imagePreviewUrl"
                class="size-8 rounded-lg object-cover"
                alt=""
              />
              <UIcon v-else name="i-lucide-image" class="text-muted size-8" />
              <UButton
                :label="
                  imageFile
                    ? t('wishlist.joint.form.imageChange')
                    : t('wishlist.joint.form.imageSelect')
                "
                color="neutral"
                variant="subtle"
                @click="openFile()"
              />
            </div>
            <p v-if="imageFile" class="text-xs text-muted mt-1.5">
              {{ imageFile.name }}
              <UButton
                :label="t('wishlist.joint.form.imageRemove')"
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
            :disabled="isSubmitDisabled"
            :loading="props.loading"
            :label="t('wishlist.joint.form.submit')"
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
