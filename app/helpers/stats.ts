import type { Config, Stat, TimeLeft } from '~/types/stats'

export function getStats(config: Config, daysTogether: number): Stat[] {
  return [
    { label: config.stats.tasks, value: '24', color: 'muted' },
    { label: config.stats.days, value: daysTogether, color: 'toned' },
    { label: config.stats.challenges, value: '156', color: 'muted' },
  ]
}

export function getTimeLeft(now: Date, startDate: Date): TimeLeft {
  const nextAnniversary = new Date(startDate)
  nextAnniversary.setFullYear(now.getFullYear())
  if (nextAnniversary < now) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }
  const diff = nextAnniversary.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export function getDaysTogether(now: Date, startDate: Date): number {
  const diff = now.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
