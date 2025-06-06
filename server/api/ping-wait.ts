export default defineEventHandler(() => {
  // Можно возвращать { ready: false } или { ready: true } для теста
  return { ready: false }
})
