type PollCallback = (data: any) => void

export function usePolling() {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isActive = ref(false)
  const url = ref('')
  const interval = ref(5000)
  const callback = ref<PollCallback | null>(null)
  const errorCount = ref(0)
  const MAX_ERRORS = 3

  const start = (pollUrl: string, pollCallback: PollCallback, pollInterval = 5000) => {
    stop()
    url.value = pollUrl
    callback.value = pollCallback
    interval.value = pollInterval
    isActive.value = true
    errorCount.value = 0
    poll()
  }

  const poll = async () => {
    if (!isActive.value)
      return

    try {
      // Comment out actual fetch
      // const res = await fetch(url.value)
      // if (!res.ok) {
      //   throw new Error(`HTTP error! status: ${res.status}`)
      // }
      // const data = await res.json()

      // Mock data for testing
      const data = { ready: false }
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

  const stop = () => {
    isActive.value = false
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    errorCount.value = 0
  }

  return {
    start,
    stop,
  }
}
