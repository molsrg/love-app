export interface Section {
  title: string
  icon: string
}

export interface Sections {
  profile: Section
  pair: Section

}

export interface Theme {
  name: string
  value: 'rose' | 'emerald' | 'blue' | 'amber' | 'indigo'
}

export interface Profile {
  name: string
  partnerName: string
  startDate: string
  theme: string
  avatar?: string
}
