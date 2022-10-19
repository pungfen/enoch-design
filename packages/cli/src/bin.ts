#!/usr/bin/env node

import { Command } from 'commander'
import { hello, build } from './actions'

const program = new Command()

program.name('Enoch CLI').version('0.0.1').usage('<command> [options]')

program.command('hello').description('hello').action(hello)

program.command('build').description('build package').option('-c --showConfig', 'show build config').action(build)

program.parse()
