import { ref } from 'vue'
import { createRPCClient } from 'vite-dev-rpc'
import { hot } from 'vite-hot-client'

const rpc = createRPCClient('vite-plugin-core', hot!) as any

export const useRpx = async () => {
  const list = ref(await rpc.list())

  const refetch = async () => {
    list.value = await rpc.list()
  }

  return { list, refetch }
}
