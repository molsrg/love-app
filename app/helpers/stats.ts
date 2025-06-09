import type { TimeLeft } from '~/types/stats'


export function getTimeLeft(now: Date, startDate: Date): TimeLeft {
  // Get current time in milliseconds
  const currentTime = now.getTime()
  
  // Calculate next anniversary
  const nextAnniversary = new Date(startDate)
  nextAnniversary.setFullYear(now.getFullYear())
  if (nextAnniversary < now) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1)
  }
  
  // Calculate time difference in milliseconds
  const diff = nextAnniversary.getTime() - currentTime
  
  // Convert to days, hours, minutes, seconds
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
