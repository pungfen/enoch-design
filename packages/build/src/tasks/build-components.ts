import { resolve } from 'path'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

import { parallel, series } from 'gulp'
import vue from '@vitejs/plugin-vue'

import glob from 'fast-glob'

import { componentsOutput, pkgComponentsRoot } from '../config'
import { excludeFiles, withTaskName } from '../utils'

import type { OutputOptions } from 'rollup'

const bundleTask = (minify: boolean) => async () => {
  const bundle = await rollup({
    input: resolve(pkgComponentsRoot, 'src', 'index.ts'),
    plugins: [
      vue({ isProduction: true }),
      nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts'] }),
      commonjs(),
      esbuild({
        minify,
        sourceMap: minify,
        target: 'esnext',
        loaders: { '.vue': 'ts' }
      })
    ],
    external: ['vue', 'lodash', 'element-plus']
  })

  await Promise.all(
    (
      [
        {
          format: 'umd',
          file: resolve(componentsOutput, 'dist', `index.full${minify ? '.min' : ''}.js`),
          exports: 'named',
          name: '@enoch/components',
          globals: { 'element-plus': 'ElementPlus', lodash: 'lodash', vue: 'Vue' },
          sourcemap: minify,
          banner: '/* umd----- */'
        },
        {
          format: 'esm',
          file: resolve(componentsOutput, 'dist', `index.full${minify ? '.min' : ''}.mjs`),
          sourcemap: minify,
          banner: '/* esm----- */'
        }
      ] as OutputOptions[]
    ).map((option) => bundle.write(option))
  )
}

const modulesTask = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', { cwd: pkgComponentsRoot, absolute: true, onlyFiles: true })
  )

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
          dir: resolve(componentsOutput, 'es'),
          preserveModules: true,
          preserveModulesRoot: resolve(componentsOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].mjs`
        },
        {
          format: 'cjs',
          dir: resolve(componentsOutput, 'lib'),
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: resolve(componentsOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].js`
        }
      ] as OutputOptions[]
    ).map((option) => bundle.write(option))
  )
}

const typesTask = async () => {}

export const buildComponents = series(
  parallel(
    withTaskName('buildComponentsBundleMinify', bundleTask(true)),
    withTaskName('buildComponentsBundle', bundleTask(false)),
    withTaskName('buildTypes', typesTask)
  ),

  withTaskName('buildComponentsModules', modulesTask)
)
