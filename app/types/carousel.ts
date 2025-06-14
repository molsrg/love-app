export interface CarouselItem {
  title: string
  subtitle: string
  main: string
  badge?: string
  call?: string
  features?: {
    icon: string
    text: string
    color: string
  }[]
  actions?: {
    primary?: {
      icon: string
      label: string
      action: string
    }
    secondary?: {
      icon: string
      label: string
      action: string
    }
  }
}
