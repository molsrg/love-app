<script lang="ts" setup>
const error = useError()
const { t } = useI18n()
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div v-if="error" class="absolute left-1/2 top-2/5 -translate-x-1/2 -translate-y-1/2  flex-col  w-full flex  items-center justify-center px-4">
    <UCard class="w-full max-w-md text-center">
      <div class="p-4">
        <p class="text-8xl font-bold text-primary">
          {{ error.statusCode }}
        </p>
        <p class="mt-4 text-xl">
          {{ error }}
        </p>
        <UButton
          :label="t('common.error.redirect')"
          class="mt-6"
          size="xl"
          @click="handleError"
        />
      </div>
    </UCard>
  </div>
</template>
