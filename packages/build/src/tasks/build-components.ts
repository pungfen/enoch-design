import { mkdir, readFile, writeFile } from 'fs/promises'
import { resolve, relative, dirname } from 'path'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

import { parallel, series } from 'gulp'
import vue from '@vitejs/plugin-vue'

// import consola from 'consola'
// import chalk from 'chalk'
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
          // 文件结构一致
          preserveModules: true,
          preserveModulesRoot: resolve(componentsOutput, 'src'),
          sourcemap: true,
          entryFileNames: `[name].mjs`
        },
        {
          format: 'cjs',
          dir: resolve(componentsOutput, 'lib'),
          exports: 'named',
          // 文件结构一致
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
  const project = new Project({ tsConfigFilePath: resolve(pkgComponentsRoot, 'tsconfig.json') })

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
      }
    })
  )

  await project.emit({ emitOnlyDtsFiles: true })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = relative(pkgComponentsRoot, sourceFile.getFilePath())
    // consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`))

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    // if (!emitFiles.length) throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)

    const tasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await mkdir(dirname(filepath), { recursive: true })
      console.log('~~~')
      await writeFile(dirname(filepath), outputFile.getText(), 'utf8')
    })

    await Promise.all(tasks)
  })

  await Promise.all(tasks)
}

export const buildComponents = series(
  parallel(
    withTaskName('buildComponentsBundleMinify', bundleTask(true)),
    withTaskName('buildComponentsBundle', bundleTask(false)),
    withTaskName('buildTypes', typesTask)
  ),

  withTaskName('buildComponentsModules', modulesTask)
)
