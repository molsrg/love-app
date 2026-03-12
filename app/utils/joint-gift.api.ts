export interface Share {
  userId: string
  percent: number
  amount: number
  contributed: number
}

export interface Contribution {
  userId: string
  amount: number
  date: string
}

export interface JointGiftResponse {
  id: string
  createdById: string
  title: string
  description?: string
  link?: string
  imageUrl?: string
  price: number
  shares: Share[]
  contributions: Contribution[]
  status: 'active' | 'funded' | 'completed'
  progress: number
  fundedAt?: string
  completedAt?: string
  createdAt: string
}

export const jointGiftApi = {
  async getAll() {
    return useApi().get<JointGiftResponse[]>('/joint-gift')
  },
  async create(data: FormData) {
    return useApi().postFormData<JointGiftResponse>('/joint-gift', data)
  },
  async delete(id: string) {
    return useApi().delete(`/joint-gift/${id}`)
  },
  async contribute(id: string, amount: number) {
    return useApi().post<JointGiftResponse>(`/joint-gift/${id}/contribute`, { amount })
  },
  async complete(id: string) {
    return useApi().patch<JointGiftResponse>(`/joint-gift/${id}/complete`, {})
  },
}
