import { getCurrentInstance, reactive, useSlots } from 'vue'

import type { UnwrapRef, SetupContext } from 'vue'

interface FactoryBaseState {
  $emit?: SetupContext['emit']
  $slots?: SetupContext['slots']
}

type UseFactoryReturn = UnwrapRef<FactoryBaseState>

export const useFactory = (): UseFactoryReturn => {
  const vm = getCurrentInstance()
  const slots = useSlots()

  const state: FactoryBaseState = { $emit: vm?.emit, $slots: slots }

  const stateProxy = reactive(state)

  return stateProxy
}
