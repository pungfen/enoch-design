import { resolve } from 'path'
import { build, defineConfig } from 'vite'
import { parallel, series } from 'gulp'
import vue from '@vitejs/plugin-vue'

import { componentsOutput, pkgComponentsRoot } from '../config'
import { withTaskName } from '../utils'

import type { BuildOptions, InlineConfig } from 'vite'

const baseConfig = defineConfig({ plugins: [vue()] })

const baseBuildConfig: BuildOptions = {
  emptyOutDir: false,
  rollupOptions: {
    external: ['vue', 'lodash', 'element-plus'],
    output: {
      globals: { 'element-plus': 'ElementPlus', lodash: 'lodash', vue: 'Vue' }
    }
  }
}

const buildBundleMinifyConfig: InlineConfig = {
  ...baseConfig,
  configFile: false,
  esbuild: { minify: true },
  build: {
    ...baseBuildConfig,
    lib: {
      entry: resolve(pkgComponentsRoot, 'src', 'index.ts'),
      name: '@enoch/components',
      fileName: 'index.min',
      formats: ['es', 'umd']
    },
    outDir: resolve(componentsOutput, 'dist'),
    sourcemap: false
  }
}

const buildBundleConfig: InlineConfig = {
  ...baseConfig,
  configFile: false,
  build: {
    ...baseBuildConfig,
    lib: {
      entry: resolve(pkgComponentsRoot, 'src', 'index.ts'),
      name: '@enoch/components',
      fileName: 'index',
      formats: ['es', 'umd']
    },
    outDir: resolve(componentsOutput, 'dist'),
    sourcemap: false
  }
}

const buildModulesConfig: InlineConfig = {
  ...baseConfig,
  configFile: false,
  build: {
    ...baseBuildConfig,
    lib: {
      entry: resolve(pkgComponentsRoot, 'src', 'index.ts'),
      name: '@enoch/components',
      fileName: 'index',
      formats: ['es', 'umd']
    },
    outDir: componentsOutput,
    sourcemap: true
  }
}

const bundleTask = (minify: Boolean) => async () => await build(minify ? buildBundleMinifyConfig : buildBundleConfig)
const modulesTask = async () => await build(buildModulesConfig)

export const buildComponents = series(
  parallel(
    withTaskName('buildComponentsBundleMinify', bundleTask(true)),
    withTaskName('buildComponentsBundle', bundleTask(false))
  ),
  withTaskName('buildComponentsModules', modulesTask)
)
