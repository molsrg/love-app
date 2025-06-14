<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'
import { LoadingIndicator } from '~/components/nuxt'

const { locale } = useI18n()
const app = useAppConfig()
</script>

<template>
  <UApp :toaster="app.toaster" :locale="(locales as any)[locale]">
    <NuxtRouteAnnouncer />
    <LoadingIndicator color="#FFFFFF" />
    <NuxtLayout>
      <div class="mx-auto px-3.5 py-1.5">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>
