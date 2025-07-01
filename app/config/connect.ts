import type { CarouselItem } from '~/types/carousel'

export const features = [
  { icon: 'i-heroicons-bell', text: 'connect.features.dates', color: 'text-primary' },
  { icon: 'i-heroicons-calendar', text: 'connect.features.dates_planning', color: 'text-primary' },
  { icon: 'i-heroicons-light-bulb', text: 'connect.features.romantic_ideas', color: 'text-primary' },
  { icon: 'i-heroicons-trophy', text: 'connect.features.challenges', color: 'text-primary' },
]

export const carouselItems: CarouselItem[] = [
  {
    title: 'connect.carousel.welcome.title',
    subtitle: '{name}',
    badge: 'connect.carousel.welcome.badge',
    main: 'connect.carousel.welcome.main',
    features,
  },
  {
    title: 'connect.carousel.create.title',
    subtitle: 'connect.carousel.create.subtitle',
    main: 'connect.carousel.create.main',
    badge: 'connect.carousel.create.badge',
    call: 'connect.carousel.create.call',
    actions: {
      primary: {
        icon: 'i-heroicons-qr-code',
        label: 'connect.carousel.create.actions.primary',
        action: 'startScanner',
      },
      secondary: {
        icon: 'i-heroicons-share',
        label: 'connect.carousel.create.actions.secondary',
        action: 'shareQR',
      },
    },
  },
]
