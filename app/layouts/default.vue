<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'

const { telegramSelectionChanged } = useHapticFeedback()
const { $isMobile } = useNuxtApp()
const route = useRoute()

interface TabItem extends TabsItem {
  value: string
}

const items: TabItem[] = [
  // {
  //   icon: 'i-material-symbols:add-link',
  //   value: '/connect',
  // },
  // {
  //   icon: 'i-material-symbols:indeterminate-question-box-rounded',
  //   value: '/activity',
  // },
  {
    icon: 'i-streamline-interface-calendar-heart-calendar-date-day-favorite-heart-like-month',
    value: '/calendar',
  },
  {
    icon: 'i-lucide-users',
    value: '/',
  },

  {
    icon: 'i-lucide-settings',
    value: '/settings',
  },
]

let isNavigating = false
const active = computed<string>({
  get(): string {
    return route.path
  },
  set(value: string): void {
    if (isNavigating || value === route.path)
      return
    isNavigating = true
    telegramSelectionChanged()
    const result = navigateTo(value)
    if (result && typeof (result as Promise<any>).finally === 'function') {
      (result as Promise<any>).finally(() => {
        isNavigating = false
      })
    }
    else {
      isNavigating = false
    }
  },
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex-1 pb-[56px]">
      <slot />
    </div>
    <UTabs
      v-model="active"
      :content="false"
      size="xl"
      class="fixed w-full px-3.5 z-50" :class="[$isMobile ? 'bottom-5' : 'bottom-1']"
      :items="items"
    />
  </div>
</template>
