<script setup lang="ts">
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

      <!-- <UCarousel
      v-slot="{ item }"
      loop
      dots
      :autoplay="{ delay: 2000 }"
      :items="pairStore.photos"
      class="w-full max-w-md mx-auto animate-slide-up opacity-0 translate-y-3"
      style="animation-delay: 0.6s"
    >
      <div class="aspect-square w-full">
        <img
          :src="item"
          class="w-full h-full object-cover rounded-lg"
          alt="Carousel image"
        >
      </div>
    </UCarousel> -->
      <UCalendar

        :fixed-weeks="false"
        class="w-full"
      />
    </div>
  </div>
</template>
