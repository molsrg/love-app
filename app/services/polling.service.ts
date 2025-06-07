type PollCallback = (data: any) => void

class PollingService {
  private timer: ReturnType<typeof setTimeout> | null = null
  private isActive = false
  private url = ''
  private interval = 5000
  private callback: PollCallback | null = null

  start(url: string, callback: PollCallback, interval = 5000) {
    this.stop()
    this.url = url
    this.callback = callback
    this.interval = interval
    this.isActive = true
    this.poll()
  }

  private async poll() {
    if (!this.isActive)
      return
    try {
      const res = await fetch(this.url)
      const data = await res.json()
      this.callback?.(data)
    }
    catch (e) {
      console.warn(e)
    }
    if (this.isActive) {
      this.timer = setTimeout(() => this.poll(), this.interval)
    }
  }

  stop() {
    this.isActive = false
    if (this.timer)
      clearTimeout(this.timer)
    this.timer = null
  }
}

export const pollingService = new PollingService()
