import type { TimeLeft } from '~/types/stats'


export function getTimeLeft(now: Date, startDate: Date): TimeLeft {
  // Create dates at midnight in local timezone
  const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const localStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  
  // Calculate next anniversary
  const nextAnniversary = new Date(localStartDate)
  nextAnniversary.setFullYear(localNow.getFullYear())
  if (nextAnniversary < localNow) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }

  const diff = nextAnniversary.getTime() - localNow.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export function getDaysTogether(now: Date, startDate: Date): number {
  // Create dates at midnight in local timezone
  const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const localStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  
  const diff = localNow.getTime() - localStartDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
