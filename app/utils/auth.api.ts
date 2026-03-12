export interface LoginResponse {
  accessToken: string
  isPaired: boolean
}

export const authApi = {
  login(initData: string | null) {
    return useApi().post<LoginResponse>('/auth/init', {
      queryString: initData,
    })
  },
}

export type AuthApiType = typeof authApi
