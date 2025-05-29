<script setup lang="ts">
import { ref } from 'vue'
import { PhotoUploadModal } from '~/components/modal'

const selectedDay = ref<any>(null)
const overlay = useOverlay()
const toast = useToast()

const modal = overlay.create(PhotoUploadModal, {
  props: {
    day: selectedDay.value,
  },
})

async function openPhotoModal(day: any) {
  console.log('Selected day:', day) // Debug log
  selectedDay.value = day
  modal.patch({ day })
  const instance = modal.open()

  const result = await instance.result

  if (result) {
    toast.add({
      title: 'Фото успешно загружено',
      color: 'success',
      id: 'photo-success',
    })
  }
  else {
    toast.add({
      title: 'Загрузка отменена',
      color: 'error',
      id: 'photo-dismiss',
    })
  }
}


</script>

<template>
  <div class="flex flex-col gap-4">
    <UBadge
      variant="subtle"
      label="Отмечай близость — следи за ритмом и здоровьем!"
      size="xl"
      :ui="{
        label: 'whitespace-normal text-center',
      }"
    />

    <CalendarApp
      icon-name="i-material-symbols-android-camera-outline"
      @update:day-click="openPhotoModal"
    />
  </div>
</template>
