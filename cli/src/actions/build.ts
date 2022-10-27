import consola from 'consola'
import { resolve } from 'path'
import { build as tsup } from 'tsup'
import { build as vite } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDts from 'vite-plugin-dts'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

import { isArray, isString } from '@enochfe/shared'

import { getUserConfig } from '../config'
import { getPackageInfo } from '../pkg'

interface BuildCommandOptions {}

export const build = async (options: BuildCommandOptions) => {
  try {
    const pkgInfo = await getPackageInfo()
    const userConfig = await getUserConfig(pkgInfo)
    const { entry, sourcemap, vue, vite: viteConfig } = userConfig

    const task: Array<Promise<any>> = []

    console.log(pkgInfo.dir, entry)

    if (vue && viteConfig) task.push(vite(viteConfig))
    else {
      task.push(
        tsup({
          entry: isArray(entry) ? entry : [entry],
          clean: true,
          dts: true,
          format: ['cjs', 'esm'],
          splitting: true,
          sourcemap
        })
      )
    }

    await Promise.all(task)
  } catch (err) {
    consola.error(err)
  }
}
