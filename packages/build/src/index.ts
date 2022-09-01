import { program } from 'commander'

import { build } from './build'
import { errorAndExit } from './consola'

import { version } from '../package.json'

program.name('Enoch Build CLI').version(version)

program
  .command('build [packageName]')
  .description('build package')
  .action((name: string) => build(name).catch((err) => errorAndExit(err)))

program.parse(process.argv)
