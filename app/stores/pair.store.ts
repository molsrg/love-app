import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { pairRepository } from '~/repositories/pair.repository'

export interface PairUser {
  id: string
  username: string
  avatar: string
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
  }
  user2: {
    id: string
    username: string
    avatarUrl: string
  }
  isHost: boolean
  startDate: string
}

export const usePairStore = defineStore('pair', () => {
  const user1: Ref<PairUser> = ref({
    id: '',
    username: '',
    avatar: '',
  })
  const user2: Ref<PairUser> = ref({
    id: '',
    username: '',
    avatar: '',
  })
  const isHost: Ref<boolean> = ref(false)
  const startDate: Ref<Date> = ref(new Date())
  const stopPolling: Ref<(() => void) | null> = ref(null)

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
    }

    user2.value = {
      id: partnerUser.id,
      username: partnerUser.username,
      avatar: partnerUser.avatarUrl,
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

  function startPairPolling(pollInterval = 3000) {
    console.warn('Starting pair polling')

    const { start, stop } = usePolling(pairRepository.getPairData)

    stopPolling.value = stop
    start(updatePairData, pollInterval)
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
  }
})
