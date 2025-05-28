export interface Stat {
  label: string
  value: string | number
  color: string
}

export interface Config {
  countdown: {
    title: string
    units: string[]
  }
  stats: {
    tasks: string
    days: string
    challenges: string
  }
}

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}
