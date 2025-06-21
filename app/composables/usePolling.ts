import { pairRepository } from '~/repositories/pair.repository'

type PollCallback = (data: any) => void
type PollFunction = () => Promise<any>

export function usePolling(pollFunction: PollFunction) {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const isActive = ref(false)
  const errorCount = ref(0)
  const MAX_ERRORS = 3

  const stop = () => {
    isActive.value = false
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    errorCount.value = 0
  }

  const poll = async (pollCallback: PollCallback, pollInterval: number) => {
    if (!isActive.value)
      return

    try {
      const data = await pollFunction()
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
      timer.value = setTimeout(() => poll(pollCallback, pollInterval), pollInterval)
  }

  const start = (pollCallback: PollCallback, pollInterval = 5000) => {
    stop()
    isActive.value = true
    errorCount.value = 0
    poll(pollCallback, pollInterval)
  }

  return {
    start,
    stop,
  }
}
