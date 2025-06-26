import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocationManager } from 'vue-tg/latest'
import { pairRepository } from '~/repositories/pair.repository'

export interface PairUser {
  id: string
  username: string
  avatar: string
  lastSeen: string
  approveGeo: boolean
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
    lastSeen: null
    approveGeo: boolean
  }
  user2: {
    id: string
    username: string
    avatarUrl: string
    lastSeen: null
    approveGeo: boolean
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
    approveGeo: false,
  })
  const user2: Ref<PairUser> = ref({
    id: '',
    username: '',
    avatar: '',
    lastSeen: '',
    approveGeo: false,
  })
  const isHost: Ref<boolean> = ref(false)
  const startDate: Ref<Date> = ref(new Date())
  const stopPolling: Ref<(() => void) | null> = ref(null)
  const locations: Ref<Array<{ lat: number, lng: number, timestamp: string }>> = ref([])
  const locationManager = useLocationManager()
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
      lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      approveGeo: true,
    }

    user2.value = {
      id: partnerUser.id,
      username: partnerUser.username,
      avatar: partnerUser.avatarUrl,
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      approveGeo: false,
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

  async function startPairPolling(pollInterval = 3000) {
    console.warn('Starting pair polling')

    const { start, stop } = usePolling(pairRepository.getPairData)
    stopPolling.value = stop

    async function handlePairUpdate(data: PairData) {
      updatePairData(data)
      await updateLocation()
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
    if (!locationManager.isAccessGranted || !locationManager.isLocationAvailable.value)
      return

    try {
      const loc = await locationManager.getLocation()
      if (loc) {
        locations.value.push({
          ...loc,
          timestamp: new Date().toISOString(),
        })
      }
    }
    catch (e) {
      console.error('Ошибка при получении геолокации', e)
    }
  }

  return {
    user1,
    user2,
    isHost,
    startDate,
    stopPolling,
    locations,
    updatePairData,
    startPairPolling,
    stopPairPolling,
    breakPair,
    updateLocation,
  }
})
