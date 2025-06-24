<script setup lang="ts">
import { ref } from 'vue'
import { PhotoUploadModal } from '~/components/modal'

definePageMeta({
  pageTransition: false,
})

// const selectedDay = ref<any>(null)
// const overlay = useOverlay()

const { t } = useI18n()

// const modal = overlay.create(PhotoUploadModal, {
//   props: {
//     day: selectedDay.value,
//   },
// })

// async function openPhotoModal(day: any) {
//   telegramSelectionChanged()
//   console.warn('Selected day:', day)
//   selectedDay.value = day
//   modal.patch({ day })
//   const instance = modal.open()

//   const result = await instance.result

//   if (result) {
//     toast.add({
//       title: 'Фото успешно загружено',
//       color: 'success',
//       id: 'photo-success',
//     })
//   }
//   else {
//     toast.add({
//       title: 'Загрузка отменена',
//       color: 'error',
//       id: 'photo-dismiss',
//     })
//   }
// }
</script>

<template>
  <div>
    <DevelopmentPage>
      <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-primary animate-bounce" />
      <UBadge
        :label="t('development.title')"
        color="primary"
        variant="solid"
        size="lg"
      />

      <UBadge
        :label="t('development.subtitle')"
        color="neutral"
        variant="subtle"
        size="lg"
      />
    </DevelopmentPage>
    <div class="flex flex-col gap-4">
      <UBadge
        variant="subtle"
        label="Здесь будут ваши совместные фото, попробуй прямо сейчас!"
        size="xl"
        :ui="{
          label: 'whitespace-normal text-center',
        }"
      />

      <UCalendar

        :fixed-weeks="false"
        class="w-full"
      />
    </div>
  </div>
</template>
