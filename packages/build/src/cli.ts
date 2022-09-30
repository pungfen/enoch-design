import { program } from 'commander'

import { build } from '.'
import { version } from '../package.json'

program.name('Enoch Build CLI').version(version)
program.command('build').description('build package').action(build)
program.parse(process.argv)
