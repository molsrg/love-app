<script setup lang="ts">
definePageMeta({
  layout: 'unauthorized',
})

const { start: _start, stop } = usePolling()
const tgWebAppStore = useTgWebAppStore()
const api = useApi()

interface Partner {
  id: string
  username: string
  avatarUrl: string
}

const partner = ref<Partner | null>(null)
const isAccepted = ref(false)
const partnerId = ref<string>('')
const startDate = ref<string>('')

async function loadPartnerInfo() {
  if (tgWebAppStore.initDataUnsafe?.start_param) {
    const [id, date] = tgWebAppStore.initDataUnsafe.start_param.split('_')
    partnerId.value = id || ''
    startDate.value = date || ''

    const res = await api.get<Partner>('/auth/user', {
      query: {
        telegramId: id,
      },
    })
    partner.value = res
  }
}

async function handleAccept() {
  if (!partnerId.value || !startDate.value)
    return

  console.warn('User accepted pair creation with:', partner.value)
  isAccepted.value = true

  try {
    if (partner.value) {
      await api.post('/auth/pair', {
        partnerId: partner.value.id,
        date: new Date(startDate.value).toISOString(),
      })
      console.warn('Pair connected successfully.')
    }
    navigateTo('/')
    useTgWebAppStore().userInPair = true
    useTgWebAppStore().isCreatePair = false
    usePairStore().startPairPolling()
  }
  catch (error) {
    console.error('Error connecting pair:', error)
    isAccepted.value = false
    navigateTo('/connect')
  }
}

function handleDecline() {
  useTgWebAppStore().isCreatePair = false 
  navigateTo('/connect')
}


onMounted(async () => {
  await loadPartnerInfo()
  // _start(_config.public.initUrl, _handlePingResponse, 3000)
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="relative" style="height: 80vh;">
    <div v-if="partner && !isAccepted" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-sm">
      <UCard class="w-full" variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold text-white text-center">
            У вас приглашение
          </h2>
        </template>

        <div class="flex flex-col items-center gap-3">
          <UAvatar
            :src="partner.avatarUrl"
            :alt="partner.username"
            size="3xl"
            class="ring-2"
          />

          <div class="text-center space-y-2">
            <h2 class="text-2xl font-bold text-white">
              {{ partner.username }}
            </h2>

            <p class="text-gray-400 text-sm">
              приглашает вас создать совместную историю в LoveMe
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3 w-full">
            <UButton
              color="error"
              variant="soft"
              class="flex-1"
              icon="i-heroicons-x-mark"
              @click="handleDecline"
            >
              Отклонить
            </UButton>
            <UButton
              color="success"
              variant="soft"
              class="flex-1"
              icon="i-heroicons-check"
              @click="handleAccept"
            >
              Согласиться
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Skeleton Loader for initial data loading -->
    <div v-else-if="!partner && !isAccepted" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-sm">
      <UCard class="w-full" variant="subtle">
        <template #header>
          <USkeleton class="h-6 w-1/2 mx-auto" />
        </template>

        <div class="flex flex-col items-center gap-3">
          <USkeleton class="h-24 w-24 rounded-full" />

          <div class="text-center space-y-2 w-full">
            <USkeleton class="h-8 w-3/4 mx-auto" />
            <USkeleton class="h-4 w-full mx-auto" />
            <USkeleton class="h-4 w-[80%] mx-auto" />
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3 w-full">
            <USkeleton class="h-10 w-full" />
            <USkeleton class="h-10 w-full" />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Existing loading/processing state -->
    <div v-else class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
      <UCard class="w-full max-w-sm" variant="subtle">
        <div class="flex flex-col items-center">
          <svg width="120" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
            <path
              fill="none"
              stroke="white"
              stroke-width="15"
              stroke-linecap="round"
              stroke-dasharray="300 385"
              stroke-dashoffset="0"
              d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="6.7"
                values="685;-685"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <h1 class="text-2xl font-bold text-white text-center mt-4">
            {{ isAccepted ? 'Почти готово!' : 'Загрузка...' }}
          </h1>
          <p v-if="isAccepted" class="text-lg text-gray-300 text-center p-2">
            Подождите, пока партнёр завершит настройку
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
