import { bold, green } from 'kolorist'
import { createUnplugin } from 'unplugin'

import { transform } from './transform'

import type { UnpluginFactory } from 'unplugin'
import type { ResolvedConfig, ViteDevServer } from 'vite'

export interface Options {
  platform?: 'vue' | 'react' | 'weapp'
}

const name = 'unplugin-enochfe'

const unplugin: UnpluginFactory<Options> = (options: Options = {}) => {
  let config: ResolvedConfig

  return {
    name,
    enforce: 'pre',
    vite: {
      configResolved(_config) {
        config = _config
      },
      configureServer(server: ViteDevServer) {
        // const _print = server.printUrls
        // server.printUrls = () => {
        //   const colorUrl = (url: string) => green(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`))
        //   const host = server.resolvedUrls?.local[0] || `${config.server.https ? 'https' : 'http'}://localhost:${config.server.port || '80'}`
        //   _print()
        //   console.log(`  ${green('➜')}  ${bold('Inspect')}: ${colorUrl(`${host}__core/`)}`)
        // }
      }
    },

    transform(code, id) {
      try {
        return transform(code, id, options)
      } catch (err: unknown) {
        this.error(`${name} ${err}`)
      }
    }
  }
}

export default createUnplugin(unplugin)
