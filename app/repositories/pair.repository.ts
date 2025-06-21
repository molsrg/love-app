import { useApi } from '~/composables/useApi'

export interface PairDataResponse {
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

export const pairRepository = {
  getPairData() {
    const api = useApi()
    return api.get<PairDataResponse>('/pair', { showErrorToast: false })
  },
}

export type PairRepository = typeof pairRepository
