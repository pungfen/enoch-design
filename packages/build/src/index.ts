#!/usr/bin/env node
import { Command } from 'commander'

import { build } from './commands/build'

const version = '0.0.1'

const program = new Command()

program.version(`@enochfe/build ${version}`)

program.command('build').description('build task').action(build)

program.parse()
