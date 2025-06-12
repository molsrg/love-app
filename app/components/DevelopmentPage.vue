<script setup lang="ts">
defineProps<{
  text?: string
  subtitle?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center" style="z-index: 40;">
    <div class="absolute inset-0  backdrop-blur-md pointer-events-auto" />
    <div class="relative pointer-events-none flex flex-col items-center gap-2">
      <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-primary animate-bounce" />
      <UBadge
        :label="text || t('development.title')"
        color="primary"
        variant="solid"
        size="lg"
      />

      <UBadge
        v-if="subtitle"
        :label="subtitle || t('development.subtitle')"
        color="neutral"
        variant="subtle"
        size="lg"
      />
    </div>
  </div>
</template>
