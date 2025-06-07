<script lang="ts" setup>
import { useViewport } from 'vue-tg'
import { LoadingIndicator } from '~/components/nuxt'
import { SAFE_AREA_MULTIPLIER } from '~/types/app'

const { $initApp } = useNuxtApp()

onMounted(async (): Promise<void> => {
  await useLocaleStore().init()
  await $initApp()
})

const app = useAppConfig()
const { contentSafeAreaInset } = useViewport()

const marginTopCalculate = computed<string>(() =>
  `${contentSafeAreaInset.value.top * SAFE_AREA_MULTIPLIER}px`,
)
</script>

<template>
  <UApp :toaster="app.toaster">
    <NuxtRouteAnnouncer />
    <LoadingIndicator
      color="#FFFFFF"
      :style="{ top: marginTopCalculate }"
    />
    <NuxtLayout>
      <div class="mx-auto p-3.5">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
