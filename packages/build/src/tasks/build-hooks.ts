import { parallel, series } from 'gulp'
import rimraf from 'rimraf'
import glob from 'fast-glob'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

import { pkgHooksRoot, hooksOutput } from '../config'
import { excludeFiles, withTaskName } from '../utils'

const modulesTask = async () => {
  const input = excludeFiles(await glob('**/*.{js,ts,vue}', { cwd: pkgHooksRoot, absolute: true, onlyFiles: true }))
  const bundle = await rollup({
    input,
    plugins: [
      esbuild({
        sourceMap: true,
        target: 'esnext',
        loaders: { '.vue': 'ts' }
      })
    ]
  })
}

const typesTask = async () => {}

export const buildHooks = series(
  withTaskName('clean-hooks', (done) => rimraf(hooksOutput, done)),
  parallel(withTaskName('build-hooks-modules', modulesTask), withTaskName('build-hooks-types', typesTask))
)
