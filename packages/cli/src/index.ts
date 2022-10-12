#!/usr/bin/env node

import { readFileSync } from 'fs'
import { program } from 'commander'
import { URL, fileURLToPath } from 'url'

import { build, defineConfig } from '@enochfe/command'

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url))
const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
export const cliVersion: string = packageJson.version

program.name('Enoch Build CLI').version(cliVersion)
program.command('build').description('build package').action(build)
program.parse(process.argv)

export { defineConfig }
