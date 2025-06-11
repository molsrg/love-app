<script setup lang="ts">
import { features } from '~/constants/app/connect'

definePageMeta({
  layout: 'unauthorized',
})
const tgWebAppStore = useTgWebAppStore()
const api = useApi()

interface Partner {
  id: string
  username: string
  avatarUrl: string
}

interface StartParams {
  id: string
  date: string
}

const partner = ref<Partner | null>(null)
const isAccepted = ref(false)
const partnerId = ref<string>('')
const startDate = ref<string>('')

function parseStartParams(startParam: string): StartParams {
  const [id, date] = startParam.split('_')
  return {
    id: id || '',
    date: date || '',
  }
}

async function loadPartnerInfo() {
  // Add 2 second delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const startParam = tgWebAppStore.initDataUnsafe?.start_param
  if (!startParam)
    return

  const { id, date } = parseStartParams(startParam)
  partnerId.value = id
  startDate.value = date

  try {
    const res = await api.get<Partner>('/user/info', {
      query: { telegramId: id },
    })
    partner.value = res
  }
  catch (error) {
    console.error('Error loading partner info:', error)
  }
}

async function handleAccept() {
  if (!partnerId.value || !startDate.value)
    return

  isAccepted.value = true

  try {
    if (partner.value) {
      await api.post('/pair', {
        partnerId: partner.value.id,
        date: new Date(startDate.value).toISOString(),
      })
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
})
</script>

<template>
  <div class="relative" style="height: 80vh;">
    <div v-if="partner && !isAccepted" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-sm">
      <UCard class="w-full" variant="subtle">
        <template #header>
          <h2 class="text-xl font-bold text-default text-center">
            {{ $t('wait.invitation') }}
          </h2>
        </template>

        <div class="flex flex-col items-center gap-3">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="partner.avatarUrl"
              :alt="partner.username"
              size="xl"
              class="ring ring-pink-500"
            />
            <div class="text-left">
              <p class="text-toned font-semibold">
                {{ partner.username }}
              </p>
              <p class="text-sm text-muted">
                {{ $t('wait.invites_to') }}
              </p>
            </div>
          </div>

          <div class="ring ring-default rounded-xl p-4 w-full">
            <h4 class="font-semibold text-white flex items-center gap-2 mb-2">
              {{ $t('wait.what_awaits') }}:
            </h4>
            <ul class="space-y-2 text-toned text-sm">
              <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-2">
                <UIcon :name="feature.icon" class="w-4 h-4 mt-0.5 flex-shrink-0" :class="feature.color" />
                {{ $t(feature.text) }}
              </li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3 w-full">
            <UButton
              color="error"
              variant="soft"
              class="flex-1 active:scale-95 transition-transform duration-100"
              icon="i-heroicons-x-mark"
              @click="handleDecline"
            >
              {{ $t('wait.decline') }}
            </UButton>
            <UButton
              color="success"
              variant="soft"
              class="flex-1 active:scale-95 transition-transform duration-100"
              icon="i-heroicons-check"
              @click="handleAccept"
            >
              {{ $t('wait.accept') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Skeleton Loader for initial data loading -->
    <div v-else-if="!partner && !isAccepted" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-sm">
      <UCard class="w-full h-[382px] flex items-center" variant="subtle">
        <div class="w-full flex flex-col items-center gap-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div class="w-12 h-12 flex items-center justify-center">
              <UIcon name="i-heroicons-heart" class="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>

          <div class="text-center space-y-2">
            <p class="text-lg font-medium text-default">
              {{ $t('wait.loading.title') }}
            </p>
            <p class="text-sm text-default-500">
              {{ $t('wait.loading.description') }}
            </p>
          </div>
        </div>
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
            {{ isAccepted ? $t('wait.processing.almost_done') : $t('wait.loading.title') }}
          </h1>
          <p v-if="isAccepted" class="text-lg text-gray-300 text-center p-2">
            {{ $t('wait.processing.wait_partner') }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
