type PollCallback = (data: any) => void

export function usePolling() {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isActive = ref(false)
  const url = ref('')
  const interval = ref(5000)
  const callback = ref<PollCallback | null>(null)

  const start = (pollUrl: string, pollCallback: PollCallback, pollInterval = 5000) => {
    stop()
    url.value = pollUrl
    callback.value = pollCallback
    interval.value = pollInterval
    isActive.value = true
    poll()
  }

  const poll = async () => {
    if (!isActive.value)
      return
    try {
      const res = await fetch(url.value)
      const data = await res.json()
      callback.value?.(data)
    }
    catch (e) {
      console.warn(e)
    }
    if (isActive.value) {
      timer.value = setTimeout(() => poll(), interval.value)
    }
  }

  const stop = () => {
    isActive.value = false
    if (timer.value)
      clearTimeout(timer.value)
    timer.value = null
  }

  return {
    start,
    stop,
  }
}
