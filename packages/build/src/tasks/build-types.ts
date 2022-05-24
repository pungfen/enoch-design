import { mkdir, readFile, writeFile } from 'fs/promises'
import { resolve, relative, dirname } from 'path'
import { map } from 'lodash'
import { Project } from 'ts-morph'
import glob from 'fast-glob'
import * as vueCompiler from 'vue/compiler-sfc'

import { excludeFiles } from '../utils'
import { pkgsRoot } from '../config'

import type { SourceFile } from 'ts-morph'

interface Options {
  input: string
  out: string
}

export const buildTypes =
  ({ input, out }: Options) =>
  async () => {
    const project = new Project({
      compilerOptions: {
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
        noImplicitAny: false,
        sourceMap: true,
        // preserveSymlinks: true,
        allowSyntheticDefaultImports: true,
        baseUrl: input,
        paths: {
          '@enochfe/*': ['packages/*']
        },
        strict: false
      },
      tsConfigFilePath: resolve(input, 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true
    })

    const files = excludeFiles(await glob('**/*.{js,ts,vue}', { cwd: input, absolute: true, onlyFiles: true }))

    await Promise.all(
      files.map(async (file) => {
        const content = await readFile(file, 'utf8')
        if (file.endsWith('.ts')) {
          project.createSourceFile(relative(process.cwd(), file), content, { overwrite: true })
          return
        }
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = ''
          let isTS = false
          if (script && script.content) {
            content += script.content
            if (script.lang === 'ts') isTS = true
          }
          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, { id: 'xxx' })
            content += compiled.content
            if (scriptSetup.lang === 'ts') isTS = true
          }
          project.createSourceFile(relative(process.cwd(), file) + (isTS ? '.ts' : '.js'), content)
        }
      })
    )

    // await project.emit({ emitOnlyDtsFiles: true })

    const sourceFiles: SourceFile[] = project.getSourceFiles()
    const diagnostics = project.getPreEmitDiagnostics()
    console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

    const task = async (sourceFile: SourceFile) => {
      const relativePath = relative(input, sourceFile.getFilePath())
      const emitOutput = sourceFile.getEmitOutput()
      const emitFiles = emitOutput.getOutputFiles()
      if (emitFiles.length === 0) {
        throw new Error(`Emit no file: ${relativePath}`)
      }

      const filepath = sourceFile.getFilePath()
      const fileName = filepath.replace(dirname(filepath), '')
      console.log(`Generating definition for file: ${filepath}`)
      await Promise.all(
        emitFiles.map(async (ef) => {
          // await mkdir(`${out}/es`, { recursive: true })
          // await writeFile(`${out}/es/${fileName}`, ef.getText(), 'utf8')
          // await mkdir(`${out}/lib`, { recursive: true })
          // await writeFile(`${out}/lib/${fileName}`, ef.getText(), 'utf8')
        })
      )
    }

    await Promise.all(map(sourceFiles, task))
  }
