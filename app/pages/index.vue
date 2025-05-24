<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { useQrScanner } from 'vue-tg'

const qrScanner = useQrScanner()
const scannedValue = ref('Здесь появится результат сканирования')
const value = ref('Hello World!')

const colorMode = useColorMode()

console.log(colorMode.preference)
</script>

<template>
  <div>
    <QrcodeVue
      size="200"
      :value="value"
    />
    <h1>Результат сканирования: {{ scannedValue }}</h1>
    <UButton @click="startScanner">
      Сканировать QR-код
    </UButton>
  </div>

  <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <select v-model="$colorMode.preference">
      <option value="system">
        System
      </option>
      <option value="light">
        Light
      </option>
      <option value="dark">
        Dark
      </option>
      <option value="sepia">
        Sepia
      </option>
    </select>
  </div>
</template>
