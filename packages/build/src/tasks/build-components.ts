import { mkdir, readFile, writeFile } from 'fs/promises'
import { resolve, relative, dirname } from 'path'
import rimraf from 'rimraf'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

import { parallel, series } from 'gulp'
import vue from '@vitejs/plugin-vue'

import { Project } from 'ts-morph'

import glob from 'fast-glob'
import * as vueCompiler from 'vue/compiler-sfc'

import { componentsOutput, pkgComponentsRoot } from '../config'
import { excludeFiles, withTaskName } from '../utils'

import type { OutputOptions } from 'rollup'
import type { SourceFile } from 'ts-morph'

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
          // ??????????????????
          preserveModules: true,
          preserveModulesRoot: resolve(componentsOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].mjs`
        },
        {
          format: 'cjs',
          dir: resolve(componentsOutput, 'lib'),
          exports: 'named',
          // ??????????????????
          preserveModules: true,
          preserveModulesRoot: resolve(componentsOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].js`
        }
      ] as OutputOptions[]
    ).map((option) => bundle.write(option))
  )
}

const typesTask = async () => {
  const project = new Project({
    compilerOptions: {
      outDir: resolve(componentsOutput, 'types')
    },
    tsConfigFilePath: resolve(pkgComponentsRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true
  })

  const sourceFiles: SourceFile[] = []

  const filePaths = excludeFiles(
    await glob('**/*.{js,ts,vue}', { cwd: pkgComponentsRoot, absolute: true, onlyFiles: true })
  )

  await Promise.all(
    filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = script?.content ?? ''
          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, { id: 'xxx' })
            content += compiled.content
          }
          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(`${relative(process.cwd(), file)}.${lang}`, content)
          sourceFiles.push(sourceFile)
        }
      } else if (file.endsWith('.ts')) {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    })
  )

  const diagnostics = project.getPreEmitDiagnostics()

  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  project.emitToMemory()

  for (const sourceFile of sourceFiles) {
    const emitOutput = sourceFile.getEmitOutput()
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filepath = outputFile.getFilePath()
      await mkdir(dirname(filepath), { recursive: true })
      await writeFile(filepath, outputFile.getText(), 'utf8')
    }
  }
}

const helperTask = async () => {}

export const buildComponents = series(
  withTaskName('clean-components', (done) => rimraf(componentsOutput, done)),
  parallel(
    withTaskName('build-components-bundle-minify', bundleTask(true)),
    withTaskName('build-components-bundle', bundleTask(false)),
    withTaskName('build-components-modules', modulesTask),
    withTaskName('build-components-types', typesTask),
    withTaskName('build-components-helper', helperTask)
  )
)
