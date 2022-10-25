import consola from 'consola'
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
    const { vue, entry, sourcemap } = userConfig

    const task: Array<Promise<any>> = []

    if (vue) {
      task.push(
        vite({
          build: {
            emptyOutDir: true,
            rollupOptions: {
              external: ['vue'],
              output: {
                exports: 'named'
              }
            },
            lib: {
              entry: isString(entry) ? entry : entry[0],
              fileName: 'index',
              formats: ['es', 'cjs']
            },
            sourcemap
          },
          plugins: [
            Vue({ reactivityTransform: true }),
            VueDts(),
            Unocss({
              presets: [presetUno(), presetAttributify(), presetIcons()],
              transformers: [transformerDirective()],
              theme: {
                colors: {
                  primary: '#4C58D9'
                }
              }
            })
          ]
        })
      )
    } else {
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
