<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'
import { useLocationManager } from 'vue-tg/latest'
import { LoadingIndicator } from '~/components/nuxt'

const app = useAppConfig()
const { locale } = useI18n()
</script>

<template>
  <UApp :toaster="app.toaster" :locale="(locales as any)[locale]">
    <NuxtRouteAnnouncer />
    <LoadingIndicator :color="app.theme.loading" />
    <NuxtLayout>
      <div class="mx-auto px-3.5 py-1.5">
        <!-- {{ useLocationManager() }} -->
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>
