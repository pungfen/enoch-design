import { program } from 'commander'

import { build } from './commands'

program.name('Enoch Build CLI').version('0.0.1')
program.command('build').description('build package').action(build)
program.parse(process.argv)
