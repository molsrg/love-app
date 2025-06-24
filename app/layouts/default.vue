<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'

const { telegramSelectionChanged } = useHapticFeedback()
const { $isMobile } = useNuxtApp()
const route = useRoute()

interface TabItem extends TabsItem {
  value: string
  icon: string
}

type NavigationResult = Promise<void> | void

const items: TabItem[] = [
  // {
  //   icon: 'i-streamline-interface-calendar-heart-calendar-date-day-favorite-heart-like-month',
  //   value: '/calendar',

  // },
  {
    icon: 'i-material-symbols-light-globe-location-pin-sharp',
    value: '/location',
  },
  {
    icon: 'i-lucide-users',
    value: '/',
  },

  {
    icon: 'i-lucide-settings',
    value: '/settings',
  },
] as const

let isNavigating = false
async function handleNavigation(value: string): Promise<void> {
  if (isNavigating || value === route.path)
    return

  isNavigating = true
  telegramSelectionChanged()

  try {
    const result = navigateTo(value) as NavigationResult
    if (result instanceof Promise) {
      await result
    }
  }
  finally {
    isNavigating = false
  }
}

const active = computed<string>({
  get(): string {
    return route.path
  },
  set(value: string): void {
    handleNavigation(value)
  },
})
</script>

<template>
  <div class="pb-[56px]">
    <slot />
  </div>
  <UTabs
    v-model="active"
    :content="false"
    size="xl"
    class="fixed w-full px-3.5 z-50" :class="[$isMobile ? 'bottom-5' : 'bottom-1']"
    :items="items"
  />
</template>
