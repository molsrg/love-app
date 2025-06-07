<script setup lang="ts">
const props = defineProps<{ day: any }>()
const emit = defineEmits<{ close: [boolean] }>()

const selectedImage = ref<string | null>(null)

function handleAvatarClick() {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  input?.click()
}

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Создаем URL для предпросмотра изображения
    selectedImage.value = URL.createObjectURL(file)
    console.warn('Selected avatar file:', file)
    // TODO: Здесь будет логика загрузки файла на сервер
  }
}
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    title="Загрузите совместное фото"
  >
    <template #body>
      <div class="flex flex-col items-center gap-4">
        <div v-if="selectedImage" class="w-full flex flex-col items-center gap-2">
          <div class="w-full max-w-md mx-auto aspect-square">
            <img
              :src="selectedImage"
              alt="Выбранное фото"
              class="w-full h-full object-cover rounded-lg"
            >
          </div>
          <UButton
            class="mx-auto"
            size="sm"
            color="neutral"
            variant="subtle"
            @click="handleAvatarClick"
          >
            Изменить
          </UButton>
        </div>
        <div v-else class="w-full max-w-md mx-auto">
          <UButton
            class="w-full aspect-square flex items-center justify-center"
            color="neutral"
            variant="subtle"
            @click="handleAvatarClick"
          >
            <div class="flex flex-col items-center gap-2">
              <UIcon name="i-material-symbols-android-camera-outline" class="text-2xl" />
              <span>Выбрать фото</span>
            </div>
          </UButton>
        </div>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarChange"
        >
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Отмена" @click="emit('close', false)" />
        <UButton
          label="Сохранить"
          :disabled="!selectedImage"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
