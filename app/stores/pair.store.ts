import { defineStore } from 'pinia'

export interface PairUser {
  id: string
  name: string
  avatar: string
}

export interface PairStats {
  tasks: number
  challenges: number | null
}

export interface PairState {
  user1: PairUser
  user2: PairUser
  isHost: boolean
  startDate: Date
  stats: PairStats
  photos: string[]
}

export const usePairStore = defineStore('pair', {
  state: (): PairState => ({
    user1: {
      id: '1',
      name: 'Пользователь 1',
      avatar: 'https://github.com/benjamincanac.png',
    },
    user2: {
      id: '2',
      name: 'Пользователь 2',
      avatar: 'https://github.com/romhml.png',
    },
    isHost: true,
    startDate: new Date('2025-05-05'),
    stats: {
      tasks: 0,
      challenges: null,
    },
    photos: [
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
      'https://images.wallpaperscraft.ru/image/single/chelovek_gory_ozero_134771_1080x1920.jpg',
    ],
  }),
})
