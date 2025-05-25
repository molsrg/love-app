<script setup lang="ts">
const stats = [
  { label: 'Свиданий', value: '24' },
  { label: 'Дней вместе', value: '365' },
  { label: 'Фотографий', value: '156' },
]

const isInputFocused = ref(false)

function handleInputFocus() {
  isInputFocused.value = true
}

function handleInputBlur() {
  isInputFocused.value = false
}
</script>

<template>
  <div>
    <div class=" mx-auto p-4">
      <div class="flex flex-col items-center space-y-6 mb-12">
        <UAvatarGroup size="3xl" :ui="{ base: 'size-25 ring-3 -me-3' }">
          <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
          <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
        </UAvatarGroup>

        <h2 class="text-3xl font-bold text-white animate-fade-in">
          Сергей и
          <span class="text-primary">Олеся</span>
        </h2>

        <!-- Статистика -->
        <div class="grid grid-cols-3 gap-4 w-full max-w-md">
          <div
            v-for="stat in stats" :key="stat.label"
            class="bg-elevated/50 rounded-xl p-4 text-center"
          >
            <div class="text-2xl font-bold text-primary">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-400">
              {{ stat.label }}
            </div>
          </div>
        </div>

        <UInput
          icon="i-lucide-search"
          class="w-full"
          size="xl"
          variant="outline"
          placeholder="Search..."
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
