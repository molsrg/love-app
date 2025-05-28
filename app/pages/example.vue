<script setup lang="ts">
import { computed, ref } from 'vue'

const cards = ref([
  { text: 'one', color: '#ec4899' },
  { text: 'two', color: '#ef4444' },
  { text: 'three', color: '#f59e42' },
  { text: 'four', color: '#38bdf8' },
])
const index = ref(0)
const x = ref(0)
const y = ref(0)
const rotation = ref(0)
const dragging = ref(false)
const isVisible = ref(true)
const approved = ref<{ text: string, color: string }[]>([])
const swipeDirection = ref<'left' | 'right' | null>(null)

const current = computed(() => cards.value[index.value])
const next = computed(() => cards.value[index.value + 1])
const afterNext = computed(() => cards.value[index.value + 2])

function onPointerDown(e: PointerEvent | TouchEvent) {
  if (dragging.value)
    return

  dragging.value = true
  swipeDirection.value = null
  const startX = 'touches' in e ? e.touches?.[0]?.clientX ?? 0 : (e as PointerEvent).clientX
  const startY = 'touches' in e ? e.touches?.[0]?.clientY ?? 0 : (e as PointerEvent).clientY

  function onMove(ev: PointerEvent | TouchEvent) {
    const clientX = 'touches' in ev ? ev.touches?.[0]?.clientX ?? 0 : (ev as PointerEvent).clientX
    const clientY = 'touches' in ev ? ev.touches?.[0]?.clientY ?? 0 : (ev as PointerEvent).clientY
    x.value = clientX - startX
    y.value = clientY - startY
    rotation.value = Math.max(Math.min(x.value / 12, 12), -12)
    if (x.value > 0)
      swipeDirection.value = 'right'
    else if (x.value < 0)
      swipeDirection.value = 'left'
    else swipeDirection.value = null
  }

  function onUp() {
    dragging.value = false
    if (Math.abs(x.value) > 120) {
      if (x.value > 0 && current.value) {
        approved.value.push(current.value)
      }
      isVisible.value = false
      setTimeout(() => {
        index.value++
        reset()
        isVisible.value = true
      }, 300)
    }
    else {
      reset()
    }
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onUp)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend', onUp)
}

function reset() {
  x.value = 0
  y.value = 0
  rotation.value = 0
  swipeDirection.value = null
}

const overlayColor = computed(() => {
  if (!dragging.value || !swipeDirection.value)
    return 'transparent'
  if (swipeDirection.value === 'left')
    return 'rgba(239,68,68,0.3)' // красный
  if (swipeDirection.value === 'right')
    return 'rgba(34,197,94,0.3)' // зеленый
  return 'transparent'
})
</script>

<template>
  <section class="container">
    <div class="approved-list">
      <span v-for="card in approved" :key="card.text" class="approved-item">
        {{ card.text }}
      </span>
    </div>
    <div class="stack">
      <!-- afterNext card (third in stack) -->
      <div
        v-if="afterNext"
        class="card card--after-next"
        :style="{
          background: afterNext.color,
        }"
      >
        <div class="card-content">
          <h1>{{ afterNext.text }}</h1>
        </div>
      </div>
      <!-- next card (second in stack) -->
      <div
        v-if="next"
        class="card card--next"
        :style="{
          background: next.color,
        }"
      >
        <div class="card-content">
          <h1>{{ next.text }}</h1>
        </div>
      </div>
      <!-- current card (top) -->
      <div
        v-if="isVisible && current"
        class="card card--current"
        :style="{
          background: current.color,
          transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
          transition: dragging ? 'none' : 'transform 0.3s',
        }"
        @touchstart.prevent="onPointerDown"
      >
        <div class="card-content">
          <h1>{{ current.text }}</h1>
        </div>
        <div class="overlay" :style="{ background: overlayColor }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.stack {
  position: relative;
  width: 300px;
  height: 400px;
  margin-top: 32px;
}
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: none;
  transition: box-shadow 0.2s, width 0.2s, height 0.2s, top 0.2s, left 0.2s;
}
.card--current {
  z-index: 3;
  cursor: grab;
  overflow: hidden;
}
.card--next {
  z-index: 2;
  width: 280px;
  height: 380px;
  left: 10px;
  top: 10px;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.10);
}
.card--after-next {
  z-index: 1;
  width: 260px;
  height: 360px;
  left: 20px;
  top: 20px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
.card-content {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 16px;
  z-index: 10;
}
.approved-list {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.approved-item {
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 1rem;
  font-weight: 500;
}
</style>
