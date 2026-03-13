export interface WishlistItemResponse {
  id: string
  title: string
  description?: string
  link?: string
  imageUrl?: string
  price?: number
  isBooked: boolean
  isReceived: boolean
  receivedAt: string | null
  createdAt: string
}

export interface PartnerWishlistItemResponse {
  id: string
  title: string
  description?: string
  link?: string
  imageUrl?: string
  price?: number
  isBooked: boolean
  isReceived: boolean
  createdAt: string
}

export interface CreateWishlistItemRequest {
  title: string
  description?: string
  link?: string
  imageUrl?: string
  price?: number
}

export const wishlistApi = {
  async getMyWishlist() {
    return useApi().get<WishlistItemResponse[]>('/wishlist')
  },
  async addWish(data: FormData) {
    return useApi().postFormData<WishlistItemResponse>('/wishlist', data)
  },
  async deleteWish(id: string) {
    return useApi().delete(`/wishlist/${id}`)
  },
  async getPartnerWishlist() {
    return useApi().get<PartnerWishlistItemResponse[]>('/wishlist/partner')
  },
  async bookWish(id: string) {
    return useApi().post(`/wishlist/${id}/book`, {})
  },
  async unbookWish(id: string) {
    return useApi().delete(`/wishlist/${id}/book`)
  },
  async receiveWish(id: string) {
    return useApi().patch(`/wishlist/${id}/receive`, {})
  },
}
