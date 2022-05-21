import { resolve } from 'path'
import { parallel, series } from 'gulp'
import rimraf from 'rimraf'
import glob from 'fast-glob'
import { rollup } from 'rollup'

import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

import { pkgHooksRoot, hooksOutput } from '../config'
import { excludeFiles, withTaskName } from '../utils'
import { buildTypes } from './build-types'

import type { OutputOptions } from 'rollup'

const modulesTask = async () => {
  const input = excludeFiles(await glob('**/*.{js,ts,vue}', { cwd: pkgHooksRoot, absolute: true, onlyFiles: true }))
  const bundle = await rollup({
    input,
    plugins: [
      vue({ isProduction: true }),
      nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts'] }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'esnext',
        loaders: { '.vue': 'ts' }
      })
    ],
    external: ['vue', 'lodash', 'element-plus'],
    treeshake: false
  })

  await Promise.all(
    (
      [
        {
          format: 'esm',
          dir: resolve(hooksOutput, 'es'),
          // 文件结构一致
          preserveModules: true,
          preserveModulesRoot: resolve(hooksOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].mjs`
        },
        {
          format: 'cjs',
          dir: resolve(hooksOutput, 'lib'),
          exports: 'named',
          // 文件结构一致
          preserveModules: true,
          preserveModulesRoot: resolve(hooksOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].js`
        }
      ] as OutputOptions[]
    ).map((option) => bundle.write(option))
  )
}

export default series(
  withTaskName('clean-hooks', (done) => rimraf(hooksOutput, done)),
  parallel(withTaskName('build-hooks-modules', modulesTask), withTaskName('build-hooks-types', buildTypes({ input: pkgHooksRoot, out: hooksOutput })))
)
