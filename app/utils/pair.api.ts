export interface PairDataResponse {
  user1: {
    id: string
    username: string
    avatarUrl: string
    geo: any
    approveGeo: boolean
  }
  user2: {
    id: string
    username: string
    avatarUrl: string
    geo: any
    approveGeo: boolean
  }
  isHost: boolean
  startDate: string
  distance: number
}

export interface ChangeDateParams {
  date: string
}

export interface ChangeNameParams {
  username: string
}

export const pairApi = {

  async getPairData() {
    return useApi().get<PairDataResponse>('/pair', { showErrorToast: false })
  },
  async changeHost() {
    return useApi().post('/pair/change-host', {})
  },
  async breakPair() {
    return useApi().delete('/pair')
  },
  async changeDate(date: string) {
    return useApi().post<unknown>('/pair/change-date', { date })
  },
  async changeAvatar(formData: FormData) {
    return useApi().postFormData('/user/change-avatar', formData)
  },
  async changeName(username: string) {
    return useApi().post<unknown>('/user/change-name', { username })
  },
}
