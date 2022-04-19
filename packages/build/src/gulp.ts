import { assign } from 'lodash'

import { buildRoot } from './paths'
import { run } from './process'

import type { TaskFunction } from 'gulp'

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) => assign(fn, { displayName: name })

export const runTask = (name: string) => withTaskName(`shellTask:${name}`, () => run(`pnpm run start ${name}`, buildRoot))
