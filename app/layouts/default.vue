<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'

import { useViewport } from 'vue-tg'

const marginBottomCalculate = computed(() => {
  const { safeAreaInset } = useViewport()
  return `${safeAreaInset.value.bottom * 0.75}px`
})

const itemss = ref<TabsItem[]>([
  {
    icon: 'i-lucide-user',
  },
  {
    icon: 'i-lucide-lock',
  },
  {
    icon: 'i-lucide-user',
  },
  {
    icon: 'i-lucide-lock',
  },
  {
    icon: 'i-lucide-user',
  },
])
</script>

<template>
  <slot />
  <UTabs :style="{ paddingBottom: marginBottomCalculate }" :content="false" size="xl" class="fixed fixed bottom-0 w-full px-4" :items="itemss" />
</template>
