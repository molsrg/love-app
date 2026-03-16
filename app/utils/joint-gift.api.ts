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

export interface UpdateJointGiftRequest {
  title?: string
  description?: string
  link?: string
  price?: number
  partnerPercent?: number
  image?: File
}

export const jointGiftApi = {
  async getAll() {
    return useApi().get<JointGiftResponse[]>('/joint-gift')
  },
  async create(data: FormData) {
    return useApi().postFormData<JointGiftResponse>('/joint-gift', data)
  },
  async update(id: string, data: UpdateJointGiftRequest) {
    const formData = new FormData()
    if (data.title !== undefined) formData.append('title', data.title)
    if (data.description !== undefined) formData.append('description', data.description)
    if (data.link !== undefined) formData.append('link', data.link)
    if (data.price !== undefined) formData.append('price', String(data.price))
    if (data.partnerPercent !== undefined) formData.append('partnerPercent', String(data.partnerPercent))
    if (data.image !== undefined) formData.append('image', data.image)
    return useApi().patch<JointGiftResponse>(`/joint-gift/${id}`, formData)
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
