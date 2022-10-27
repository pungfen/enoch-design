#!/usr/bin/env node

import { Command } from 'commander'
import { build, copy } from './actions'

const program = new Command()

program.name('Enoch CLI').version('0.0.1').usage('<command> [options]')

program.command('build').description('build package').action(build)
program.command('copy <source> [destination]').description('copy source into a new destination').action(copy)

program.parse()
