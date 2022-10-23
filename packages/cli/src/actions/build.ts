import consola from 'consola'
import { build as tsup, type Options } from 'tsup'
import Vue from 'unplugin-vue/esbuild'

import { getUserConfig } from '../config'
import { getPackageInfo } from '../pkg'

interface BuildCommandOptions {
  showConfig?: boolean
}

export const build = async (options: BuildCommandOptions) => {
  try {
    const pkgInfo = await getPackageInfo()
    const userConfig = await getUserConfig(pkgInfo)

    const config: Options = {
      ...userConfig,
      name: 'enoch-cli tsup',
      esbuildOptions(options) {
        options.entryNames = `[dir]/[name]`
      },
      esbuildPlugins: [Vue({ reactivityTransform: true })],
      target: 'es2019'
    }

    if (options.showConfig) consola.log(config)
    await tsup(config)
  } catch (err) {
    consola.error(err)
  }
}
