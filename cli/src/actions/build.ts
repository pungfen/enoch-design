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
    const { vue, entry, sourcemap } = userConfig

    const task: Array<Promise<any>> = []

    if (vue) {
      task.push(
        vite({
          build: {
            minify: true,
            chunkSizeWarningLimit: 2,
            reportCompressedSize: true,
            emptyOutDir: true,
            lib: {
              entry: isString(entry) ? entry : entry[0],
              name: 'EnochComponent'
            },
            rollupOptions: {
              external: ['vue'],
              output: [
                {
                  format: 'umd',
                  exports: 'named',
                  sourcemap,
                  dir: resolve(pkgInfo.dir, 'dist', 'dist'),
                  entryFileNames: 'index.umd.js',
                  chunkFileNames: '[name].js',
                  assetFileNames: '[name].[ext]',
                  namespaceToStringTag: true,
                  manualChunks: undefined,
                  inlineDynamicImports: false,
                  globals: { vue: 'Vue' }
                },
                {
                  format: 'es', // 打包模式 https://rollupjs.org/guide/en/#outputformat
                  exports: 'named', // 导出模式 https://rollupjs.org/guide/en/#outputexports
                  dir: resolve(pkgInfo.dir, 'dist', 'es'), // 输出路径 https://rollupjs.org/guide/en/#outputdir
                  sourcemap: false, // https://rollupjs.org/guide/en/#outputsourcemap
                  entryFileNames: 'index.js', // 输出后的文件名 https://rollupjs.org/guide/en/#outputentryfilenames
                  chunkFileNames: '[name].js', // 输出的 chunk文件名 https://rollupjs.org/guide/en/#outputchunkfilenames
                  assetFileNames: '[name].[ext]', // 输出资产文件名 https://rollupjs.org/guide/en/#outputassetfilenames
                  namespaceToStringTag: true, // https://rollupjs.org/guide/en/#outputnamespacetostringtag
                  inlineDynamicImports: false, // https://rollupjs.org/guide/en/#outputinlinedynamicimports
                  manualChunks: undefined,
                  preserveModules: true // https://rollupjs.org/guide/en/#outputpreservemodules
                },
                {
                  format: 'cjs',
                  exports: 'named',
                  dir: resolve(pkgInfo.dir, 'dist', 'lib'),
                  sourcemap: false,
                  entryFileNames: 'index.js',
                  chunkFileNames: '[name].js',
                  assetFileNames: '[name].[ext]',
                  namespaceToStringTag: true,
                  inlineDynamicImports: false,
                  manualChunks: undefined,
                  preserveModules: true
                }
              ]
            }
          },
          plugins: [
            Vue({ reactivityTransform: true }),
            VueDts({
              outputDir: ['./dist/types'],
              insertTypesEntry: true, // 是否生成类型声明入口
              cleanVueFileName: true, // 是否将 '.vue.d.ts' 文件名转换为 '.d.ts'
              copyDtsFiles: true // 是否将源码里的 .d.ts 文件复制到 outputDir
            }),
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
