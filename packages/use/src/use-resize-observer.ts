import { computed, onBeforeUnmount, ref, unref, watchEffect } from 'vue'
import type { Ref } from 'vue'

export const useResizeObserver = (element: Ref<HTMLElement | null | undefined>) => {
  let observer: ResizeObserver | undefined

  let rect = ref({ height: 0, width: 0 })

  const isSupported = computed(() => window && 'ResizeObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watchEffect(() => {
    cleanup()
    if (unref(element) && isSupported) {
      observer = new ResizeObserver((res) => (rect.value = res[0].contentRect))
      observer.observe?.(unref(element)!)
    }
  })

  const stop = () => {
    cleanup()
    stopWatch()
  }

  onBeforeUnmount(stop)

  return { rect, stop }
}
