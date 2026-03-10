export interface WishlistItemResponse {
  id: string
  title: string
  description?: string
  link?: string
  imageUrl?: string
  price?: number
  isBooked: boolean
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
  async addWish(data: CreateWishlistItemRequest) {
    return useApi().post<WishlistItemResponse>('/wishlist', data)
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
}
