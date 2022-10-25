import { onBeforeMount } from 'vue'

import { id as mockId } from '../utils/mock'

let cachedContainer: HTMLElement

export const POPPER_CONTAINER_ID = `en-popper-container-${mockId()}`

const createContainer = () => {
  const container = document.createElement('div')
  container.id = POPPER_CONTAINER_ID
  document.body.appendChild(container)
  return container
}

export const usePopperContaier = () => {
  onBeforeMount(() => {
    const container = document.body.querySelector(`#${POPPER_CONTAINER_ID}`)
    if (!cachedContainer || !container) {
      cachedContainer = createContainer()
    }
  })
}
