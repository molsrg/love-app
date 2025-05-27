<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // Здесь можно добавить обработку выбранного файла
    console.log('Selected file:', file)
  }
}

function openFileDialog() {
  fileInput.value?.click()
}
</script>

<template>
  <div>
    {{ fileInput }}
    <UInput type="image" />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    >
    <UButton
      label="Фото"
      icon="i-lucide-image"
      @click="openFileDialog"
    />
  </div>
</template>

<style>

</style>
