<script setup lang="ts">
import { ref } from 'vue'
import { PhotoUploadModal } from '~/components/modal'

const selectedDay = ref<any>(null)
const overlay = useOverlay()
const toast = useToast()
const { t } = useI18n()

const modal = overlay.create(PhotoUploadModal, {
  props: {
    day: selectedDay.value,
  },
})

async function openPhotoModal(day: any) {
  console.warn('Selected day:', day)
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

  <div >
    <DevelopmentPage
      :text="t('development.title')"
      :subtitle="t('development.subtitle')"
    />
      <div class="flex flex-col gap-4">
        <UBadge
          variant="subtle"
          label="Здесь будут ваши совместные фото, попробуй прямо сейчас!"
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
    </div>

    
</template>
