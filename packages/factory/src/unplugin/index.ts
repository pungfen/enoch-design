import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'

import { REGEX_SETUP_SFC, REGEX_VUE_SFC } from './constants'
import { transform } from './transform'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
}

export type OptionsResolved = Omit<Required<Options>, 'exclude'> & {
  exclude?: FilterPattern
}

function resolveOption(options: Options): OptionsResolved {
  return {
    include: options.include || [REGEX_VUE_SFC, REGEX_SETUP_SFC],
    exclude: options.exclude || undefined
  }
}

export default createUnplugin((userOptions: Options = {}) => {
  const options = resolveOption(userOptions)
  const filter = createFilter(options.include, options.exclude)

  const name = '@enochfe/factory'

  return {
    name,
    enforce: 'pre',

    transformInclude(id) {
      return filter(id)
    },

    transform(code, id) {
      try {
        return transform(code, id)
      } catch (err: unknown) {
        this.error(`${name} ${err}`)
      }
    }
  }
})

export { transform }
