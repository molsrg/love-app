<script lang="ts" setup>
import { useViewport } from 'vue-tg'
import { LoadingIndicator } from '~/components/nuxt'
import { SAFE_AREA_MULTIPLIER } from '~/types/app'

onMounted(async (): Promise<void> => {
  await useLocaleStore().init()
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
      <div class="mx-auto p-4 mb-14">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>
