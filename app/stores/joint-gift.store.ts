import type { JointGiftResponse } from '~/utils/joint-gift.api'

export const useJointGiftStore = defineStore('jointGift', () => {
  const items = ref<JointGiftResponse[]>([])
  const isLoading = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      const data = await jointGiftApi.getAll()
      if (data)
        items.value = data
    }
    finally {
      isLoading.value = false
    }
  }

  async function createItem(data: FormData) {
    const newItem = await jointGiftApi.create(data)
    if (newItem)
      items.value.unshift(newItem)
  }

  async function removeItem(id: string) {
    await jointGiftApi.delete(id)
    items.value = items.value.filter(item => item.id !== id)
  }

  async function contributeToItem(id: string, amount: number) {
    const updated = await jointGiftApi.contribute(id, amount)
    if (updated) {
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1)
        items.value[index] = updated
    }
  }

  async function completeItem(id: string) {
    const updated = await jointGiftApi.complete(id)
    if (updated) {
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1)
        items.value[index] = updated
    }
  }

  return {
    items,
    isLoading,
    fetchAll,
    createItem,
    removeItem,
    contributeToItem,
    completeItem,
  }
})
