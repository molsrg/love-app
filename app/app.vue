<script lang="ts" setup>
import { useViewport } from 'vue-tg'
import { LoadingIndicator } from '~/components/nuxt'

const { contentSafeAreaInset } = useViewport()
const app = useAppConfig()

const marginTopCalculate = computed<string>(() =>
  `${contentSafeAreaInset.value.top * 2}px`,
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
      <div class="mx-auto px-3.5 py-1.5">
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
