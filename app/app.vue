<script lang="ts" setup>
import { useViewport } from 'vue-tg'
import { LoadingIndicator } from '~/components/nuxt'
import { useTgWebAppStore } from '~/stores/tgWebApp.store'
import { usePairStore } from '~/stores/pair.store'

const { contentSafeAreaInset } = useViewport()
const app = useAppConfig()
const tgWebAppStore = useTgWebAppStore()
const pairStore = usePairStore()

// onMounted(async () => {
//   await tgWebAppStore.init()
// })

// watch(() => tgWebAppStore.userInPair, (isPaired) => {
//   if (isPaired) {
//     console.warn('User is now paired. Starting polling...')
//     pairStore.startPairPolling()
//   }
// })

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
