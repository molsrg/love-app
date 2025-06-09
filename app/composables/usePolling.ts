type PollCallback = (data: any) => void

export function usePolling() {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isActive = ref(false)
  const url = ref('')
  const interval = ref(5000)
  const callback = ref<PollCallback | null>(null)
  const errorCount = ref(0)
  const MAX_ERRORS = 3
  const config = useRuntimeConfig()
  const tokenStore = useTokenStore()

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (tokenStore.getStatus) {
      headers.Authorization = `Bearer ${tokenStore.getToken}`
    }

    return headers
  }

  const stop = () => {
    isActive.value = false
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    errorCount.value = 0
  }

  const poll = async () => {
    if (!isActive.value)
      return

    try {
      const res = await fetch(`${config.public.baseBackendUrl}${url.value}`, {
        headers: getHeaders(),
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      callback.value?.(data)
      errorCount.value = 0
    }
    catch (e) {
      console.warn('Polling error:', e)
      errorCount.value++

      if (errorCount.value >= MAX_ERRORS) {
        console.error('Max polling errors reached, stopping')
        stop()
        return
      }
    }

    if (isActive.value) {
      timer.value = setTimeout(() => poll(), interval.value)
    }
  }

  const start = (pollUrl: string, pollCallback: PollCallback, pollInterval = 5000) => {
    stop()
    url.value = pollUrl
    callback.value = pollCallback
    interval.value = pollInterval
    isActive.value = true
    errorCount.value = 0
    poll()
  }

  return {
    start,
    stop,
  }
}
