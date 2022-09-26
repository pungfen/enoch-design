import consola from 'consola'
import { build as tsup } from 'tsup'

// import Vue from 'unplugin-vue/esbuild'

import { getPackageInfo } from '../pkg'
import { getUserConfig } from '../config'

import type { Options } from 'tsup'

export async function build() {
  try {
    const pkgInfo = await getPackageInfo()
    const userConfig = await getUserConfig(pkgInfo)

    const { entry, name, clean, outDir, minify, format, dts, vue, platform } = userConfig

    // process.chdir(pkgInfo.dir)

    // if (clean) await rm(outDir, { recursive: true, force: true })

    const tasks: Array<Promise<void>> = []

    const options: Options = {
      name,
      clean,
      entry,
      minify,
      outDir,
      format,
      platform,
      splitting: false,
      dts: dts && {
        compilerOptions: {}
      },
      esbuildPlugins: [],
      esbuildOptions(options) {
        options.entryNames = minify ? `[dir]/[name].min` : `[dir]/[name]`
      }
    }

    // if (vue) options.esbuildPlugins.push(Vue())

    tasks.push(tsup(options))
    await Promise.all(tasks)
  } catch (err) {
    consola.error(err)
  }
}
