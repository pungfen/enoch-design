import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type MaybeRef<T> = T | Ref<T>

type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>

type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>

interface ConfigurableWindow {
  window?: Window
}

interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
}

const isClient = typeof window !== 'undefined'

const defaultWindow = /* #__PURE__ */ isClient ? window : undefined

export const useCssVar = (prop: string, target?: Element, { window = defaultWindow, initialValue = '' }: UseCssVarOptions = {}) => {
  const variable = ref(initialValue)

  const elRef = computed(() => unref(target) || window?.document?.documentElement)

  return variable
}
