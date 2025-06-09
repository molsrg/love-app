import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { usePolling } from '~/composables/usePolling'

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

export const usePairStore = defineStore('pair', {
  state: (): PairState => ({
    user1: {
      id: '',
      username: '',
      avatar: '',
    },
    user2: {
      id: '',
      username: '',
      avatar: '',
    },
    isHost: false,
    startDate: new Date(),
  }),
  actions: {
    updatePairData(data: PairData) {
      this.user1.id = data.user1.id
      this.user1.username = data.user1.username
      this.user1.avatar = data.user1.avatarUrl

      this.user2.id = data.user2.id
      this.user2.username = data.user2.username
      this.user2.avatar = data.user2.avatarUrl

      this.isHost = data.isHost
      this.startDate = new Date(data.startDate)
    },
    startPairPolling(pollInterval: number = 3000) {
      console.warn('Starting pair polling')

      const { start, stop: _stop } = usePolling()
      const _api = useApi()

      const handlePollingResponse = async (data: any) => {
        this.updatePairData(data)
      }

      start('/pair', handlePollingResponse, pollInterval)
    },
    stopPairPolling() {
      const { stop } = usePolling()
      stop()
    },
  },
})
