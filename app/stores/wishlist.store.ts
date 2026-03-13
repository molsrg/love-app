import type { PartnerWishlistItemResponse, WishlistItemResponse } from '~/utils/wishlist.api'

export const useWishlistStore = defineStore('wishlist', () => {
  const myItems = ref<WishlistItemResponse[]>([])
  const partnerItems = ref<PartnerWishlistItemResponse[]>([])
  const isLoadingMine = ref(false)
  const isLoadingPartner = ref(false)

  async function fetchMyWishlist() {
    isLoadingMine.value = true
    try {
      const data = await wishlistApi.getMyWishlist()
      if (data)
        myItems.value = data
    }
    finally {
      isLoadingMine.value = false
    }
  }

  async function fetchPartnerWishlist() {
    isLoadingPartner.value = true
    try {
      const data = await wishlistApi.getPartnerWishlist()
      if (data)
        partnerItems.value = data
    }
    finally {
      isLoadingPartner.value = false
    }
  }

  async function addItem(data: FormData) {
    const newItem = await wishlistApi.addWish(data)
    if (newItem)
      myItems.value.unshift(newItem)
  }

  async function removeItem(id: string) {
    await wishlistApi.deleteWish(id)
    myItems.value = myItems.value.filter(item => item.id !== id)
  }

  async function bookItem(id: string) {
    await wishlistApi.bookWish(id)
    const item = partnerItems.value.find(i => i.id === id)
    if (item)
      item.isBooked = true
  }

  async function unbookItem(id: string) {
    await wishlistApi.unbookWish(id)
    const item = partnerItems.value.find(i => i.id === id)
    if (item)
      item.isBooked = false
  }

  async function receiveItem(id: string) {
    await wishlistApi.receiveWish(id)
    myItems.value = myItems.value.filter(item => item.id !== id)
  }

  return {
    myItems,
    partnerItems,
    isLoadingMine,
    isLoadingPartner,
    fetchMyWishlist,
    fetchPartnerWishlist,
    addItem,
    removeItem,
    bookItem,
    unbookItem,
    receiveItem,
  }
})
