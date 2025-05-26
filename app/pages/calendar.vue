<script setup lang="ts">
</script>

<template>
  <div class="flex p-2 flex-col gap-4">
    <UBadge
      variant="subtle"
      label="Отмечай близость — следи за ритмом и здоровьем!"
      size="xl"
      :ui="{
        label: 'whitespace-normal text-center',
      }"
    />

    <CalendarApp
      icon-name="i-material-symbols-heart-check-outline-rounded"
      @update:model-value="changeDayActivity"
    />
  </div>
</template>
