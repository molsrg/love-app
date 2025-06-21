export interface LoginResponse {
  accessToken: string
  isPaired: boolean
}

export const authRepository = {
  login(initData: string | null) {
    const api = useApi()
    return api.post<LoginResponse>('/auth/init', {
      queryString: initData,
    })
  },
}

export type AuthRepository = typeof authRepository
