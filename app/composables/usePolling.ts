type PollCallback = (data: any) => void

export function usePolling() {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isActive = ref(false)
  const errorCount = ref(0)
  const MAX_ERRORS = 3
  const api = useApi()

  const stop = () => {
    isActive.value = false
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    errorCount.value = 0
  }

  const poll = async (pollUrl: string, pollCallback: PollCallback, pollInterval: number) => {
    if (!isActive.value)
      return

    try {
      const data = await api.get(pollUrl, { showErrorToast: false })
      pollCallback(data)
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

    if (isActive.value)
      timer.value = setTimeout(() => poll(pollUrl, pollCallback, pollInterval), pollInterval)
  }

  const start = (pollUrl: string, pollCallback: PollCallback, pollInterval = 5000) => {
    stop()
    isActive.value = true
    errorCount.value = 0
    poll(pollUrl, pollCallback, pollInterval)
  }

  return {
    start,
    stop,
  }
}
