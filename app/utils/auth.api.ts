import type { components } from '~/shared/api.types'

type LoginRequest = components['schemas']['CreateUserDto']
type LoginResponse = components['schemas']['CreateUserResponseDto']

export const authApi = {
  login(body: LoginRequest) {
    return useApi().post<LoginResponse>('/auth/init', body)
  },
}
