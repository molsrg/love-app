export default defineNuxtPlugin(() => {
  const closeKeyboard = (e: Event) => {
    const target = e.target as HTMLElement
    const activeElement = document.activeElement as HTMLElement

    if (
      activeElement
      && (activeElement.tagName === 'INPUT'
        || activeElement.tagName === 'TEXTAREA')
    ) {
      if (!target.closest('input') && !target.closest('textarea')) {
        activeElement.blur()
      }
    }
  }

  const preventScroll = (e: Event) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const scrollPosition = window.scrollY

      // Используем несколько таймаутов с разными задержками
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
      setTimeout(() => window.scrollTo(0, scrollPosition), 50)
      setTimeout(() => window.scrollTo(0, scrollPosition), 100)
    }
  }

  // Убираем блокировку touchmove
  // document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

  document.addEventListener('focusin', preventScroll, true)

  const style = document.createElement('style')
  style.textContent = `
    input, textarea {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: auto;
    }
  `
  document.head.appendChild(style)

  document.addEventListener('touchstart', closeKeyboard)
  document.addEventListener('mousedown', closeKeyboard)
  document.addEventListener('focus', preventScroll, true)

  return {
    provide: {},
    cleanup() {
      document.removeEventListener('touchstart', closeKeyboard)
      document.removeEventListener('mousedown', closeKeyboard)
      document.removeEventListener('focus', preventScroll, true)
      document.removeEventListener('focusin', preventScroll, true)
      document.head.removeChild(style)
    },
  }
})
