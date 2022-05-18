import { getCurrentInstance, reactive, useSlots, type UnwrapRef, type SetupContext } from 'vue'

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
