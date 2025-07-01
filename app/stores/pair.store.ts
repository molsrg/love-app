import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocationManager } from 'vue-tg/latest'

export interface GeoData {
  latitude: number
  longitude: number
  timestamp: string
  approveGeo?: boolean
}

export interface PairUser {
  id: string
  username: string
  avatar: string
  lastSeen: string
  geo: GeoData | null
}

export interface PairState {
  user1: PairUser
  user2: PairUser
  isHost: boolean
  startDate: Date
  stopPolling: (() => void) | null
}

interface PairData {
  user1: {
    id: string
    username: string
    avatarUrl: string
    geo: GeoData | null
  }
  user2: {
    id: string
    username: string
    avatarUrl: string
    geo: GeoData | null
  }
  isHost: boolean
  startDate: string
}

export const usePairStore = defineStore('pair', () => {
  const user1: Ref<PairUser> = ref({
    id: '',
    username: '',
    avatar: '',
    lastSeen: '',
    geo: null,
  })
  const user2: Ref<PairUser> = ref({
    id: '',
    username: '',
    avatar: '',
    lastSeen: '',
    geo: null,
  })
  const isHost: Ref<boolean> = ref(false)
  const startDate: Ref<Date> = ref(new Date())
  const stopPolling: Ref<(() => void) | null> = ref(null)

  const locationManager = useLocationManager()
  const { $accessGranted, $isLocationAvailable } = useNuxtApp()
  function updatePairData(data: PairData) {
    if (Object.keys(data).length === 0) {
      breakPair()
      return
    }

    const currentUser = data.isHost ? data.user1 : data.user2
    const partnerUser = data.isHost ? data.user2 : data.user1

    user1.value = {
      id: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatarUrl,
      lastSeen: '',
      geo: currentUser.geo ?? null,
    }

    user2.value = {
      id: partnerUser.id,
      username: partnerUser.username,
      avatar: partnerUser.avatarUrl,
      lastSeen: '',
      geo: partnerUser.geo ?? null,
    }

    isHost.value = data.isHost

    const utcDate = new Date(data.startDate)
    startDate.value = new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      0,
      0,
      0,
      0,
    )
  }

  async function startPairPolling(pollInterval = 8000) {
    console.warn('Starting pair polling')

    const { start, stop } = usePolling(pairApi.getPairData)
    stopPolling.value = stop

    async function handlePairUpdate(data: PairData) {
      if ($accessGranted.value && $isLocationAvailable.value) {
        await updateLocation()
      }
      updatePairData(data)
    }

    start(handlePairUpdate, pollInterval)
  }

  function stopPairPolling() {
    if (stopPolling.value) {
      stopPolling.value()
      stopPolling.value = null
    }
  }

  function breakPair() {
    stopPairPolling()
    const tgWebAppStore = useTgWebAppStore()
    tgWebAppStore.setUserInPair(false)
    tgWebAppStore.setIsCreatePair(false)
    navigateTo('/connect')
  }

  async function updateLocation() {
    try {
      const loc = await locationManager.getLocation()
      if (loc) {
        const geoPoint = {
          ...loc,
          timestamp: new Date().toISOString(),
        }

        try {
          await useApi().post('/geo', geoPoint)
        }
        catch (e) {
          console.warn('Ошибка при отправке геолокации на /geo', e)
          if (typeof useToast === 'function') {
            useErrorToast()({

              title: 'Ошибка',
              description: 'Ошибка при отправке геолокации',
            })
          }
        }
      }
    }
    catch (e) {
      console.error('Ошибка при получении геолокации', e)
      if (typeof useToast === 'function') {
        useErrorToast()({
          color: 'error',
          title: 'Ошибка',
          description: 'Ошибка при получении геолокации',
        })
      }
    }
  }

  return {
    user1,
    user2,
    isHost,
    startDate,
    stopPolling,
    updatePairData,
    startPairPolling,
    stopPairPolling,
    breakPair,
    updateLocation,
  }
})
