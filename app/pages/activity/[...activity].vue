<script setup lang="ts">
import { useBackButton } from 'vue-tg'

const backButton = useBackButton()
backButton?.show()
backButton?.onClick(() => {
  navigateTo('/activity')
})
</script>

<template>
    <div>
        <h1>Activity</h1>
    </div>
</template>



