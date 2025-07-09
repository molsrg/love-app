import gsap from 'gsap'

export function useAnimatedNumber(initialValue = 0, duration = 3, delay = 200) {
  const animatedValue = ref(initialValue)
  let tween: gsap.core.Tween | null = null
  let delayTimeout: ReturnType<typeof setTimeout> | null = null

  function animateTo(newValue: number) {
    if (tween)
      tween.kill()
    if (delayTimeout)
      clearTimeout(delayTimeout)
    delayTimeout = setTimeout(() => {
      tween = gsap.to(animatedValue, {
        value: newValue,
        duration,
        ease: 'power3.out',
        snap: { value: 0.1 },
        overwrite: true,
      })
    }, delay)
  }

  onUnmounted(() => {
    if (tween)
      tween.kill()
    if (delayTimeout)
      clearTimeout(delayTimeout)
  })

  return {
    animatedValue,
    animateTo,
  }
}
