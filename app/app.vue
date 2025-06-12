<script lang="ts" setup>
import { LoadingIndicator } from '~/components/nuxt'

const app = useAppConfig()
</script>

<template>
  <UApp :toaster="app.toaster">
    <NuxtRouteAnnouncer />
    <LoadingIndicator color="#FFFFFF" />
    <NuxtLayout>
      <div class="mx-auto px-3.5 py-1.5">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </UApp>
</template>
