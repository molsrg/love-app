<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import { useViewport } from 'vue-tg'

const route = useRoute()
const marginBottomCalculate = computed<string>(() => {
  const { safeAreaInset } = useViewport()
  return `${safeAreaInset.value.bottom * 0.5 + 5}px`
})

interface TabItem extends TabsItem {
  value: string
}

const items: TabItem[] = [
  {
    icon: 'i-streamline-interface-calendar-heart-calendar-date-day-favorite-heart-like-month',
    value: '/connect',
  },
  {
    icon: 'i-material-symbols:indeterminate-question-box-rounded',
    value: '/activity',
  },
  {
    icon: 'i-lucide-users',
    value: '/',
  },
  {
    icon: 'i-lucide-chart-line',
    value: '/calendar',
  },
  {
    icon: 'i-lucide-settings',
    value: '/settings',
  },
]

const active = computed<string>({
  get(): string {
    return route.path
  },
  set(value: string): void {
    navigateTo(value)
  },
})
</script>

<template>
  <slot />

  <UTabs
    v-model="active"
    :style="{ paddingBottom: marginBottomCalculate }"
    :content="false"
    size="xl"
    class="fixed bottom-0 w-full px-4"
    :items="items"
  />
</template>
