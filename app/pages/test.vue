<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

interface Movie {
  id: number
  title: string
  description: string
  imageUrl: string
  year: number
  rating: number
}

// Данные фильмов
const movies = ref<Movie[]>([
  {
    id: 1,
    title: 'Inception',
    description: 'Криминальный триллер о проникновении в подсознание людей через сны. Доминик Кобб — лучший из лучших в опасном искусстве извлечения информации из человеческого разума.',
    imageUrl: 'https://image.openmoviedb.com/kinopoisk-images/1773646/21e00697-6f18-4cfb-b19c-d1de7e5e8027/orig',
    year: 2010,
    rating: 8.8,
  },
  {
    id: 2,
    title: 'The Dark Knight',
    description: 'Когда в городе Готэм появляется загадочный преступник, известный как Джокер, Бэтмен должен принять одно из величайших психологических и физических испытаний.',
    imageUrl: 'https://image.openmoviedb.com/kinopoisk-images/1773646/21e00697-6f18-4cfb-b19c-d1de7e5e8027/orig',
    year: 2008,
    rating: 9.0,
  },
  {
    id: 3,
    title: 'Interstellar',
    description: 'Группа исследователей отправляется через червоточину в поисках нового дома для человечества, пока Земля становится непригодной для жизни.',
    imageUrl: 'https://image.openmoviedb.com/kinopoisk-images/1773646/21e00697-6f18-4cfb-b19c-d1de7e5e8027/orig',
    year: 2014,
    rating: 8.6,
  },

])

const currentMovieIndex = ref(0)
const currentMovie = computed(() => movies.value[currentMovieIndex.value])

const el = ref<HTMLElement | null>(null)

// Стили для карточки
const cardStyle = ref({
  transform: 'rotate(0deg)',
  transformOrigin: 'bottom center',
  transition: 'transform 0.1s ease-out',
})

const { direction, isSwiping, lengthX } = useSwipe(el, {
  threshold: 10,
  onSwipeEnd() {
    if (Math.abs(lengthX.value) > 100) {
      if (currentMovieIndex.value < movies.value.length - 1) {
        currentMovieIndex.value++
      }
    }

    cardStyle.value = {
      transform: 'rotate(0deg)',
      transformOrigin: 'transformOrigin center',
      transition: 'transform 0.3s ease-out',
    }
  },
})

// Вычисляем стили карточки на основе свайпа
watch([lengthX, isSwiping], ([x, swiping]) => {
  if (swiping) {
    const rotation = -x * 0.01
    cardStyle.value = {
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
      transition: 'transform 0.1s ease-out',
    }
  }
})

// Вычисляем цвет фона и прозрачность в зависимости от направления и расстояния
const cardClasses = computed(() => {
  if (!isSwiping.value)
    return ''

  const maxDistance = 200
  const _opacity = Math.min(Math.abs(lengthX.value) / maxDistance, 1)

  if (direction.value === 'right') {
    return `bg-success-50 dark:bg-success-900/20 border-success-500`
  }
  else if (direction.value === 'left') {
    return `bg-error-50 dark:bg-error-900/20 border-error-500`
  }
  return ''
})

// Вычисляем стили для индикаторов
const indicatorStyle = computed(() => {
  if (!isSwiping.value)
    return { opacity: 0 }

  const maxDistance = 200
  const opacity = Math.min(Math.abs(lengthX.value) / maxDistance, 1)

  return {
    opacity,
    transform: `scale(${1 + opacity * 0.2})`,
  }
})
</script>

<template>
  <div class="p-4 mx-auto">
    <div v-if="currentMovie" class="relative">
      <UCard
        ref="el"
        class="relative   transition-colors duration-200"
        :class="cardClasses"
        :style="cardStyle"
        variant="subtle"
      >
        <img
          :src="currentMovie.imageUrl"
          :alt="currentMovie.title"
          class="w-full object-cover rounded-lg "
        >
      </UCard>

      <!-- Счетчик карточек -->
      <div class="text-center mt-4 text-gray-500">
        {{ currentMovieIndex + 1 }} из {{ movies.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.2s ease-out;
}
</style>
