import { program } from 'commander'

import { build, defineConfig } from '@enochfe/command'
import { version } from '../package.json'

program.name('Enoch Build CLI').version(version)
program.command('build').description('build package').action(build)
program.parse(process.argv)

export { defineConfig }
