import { assign } from 'lodash'
import type { TaskFunction } from 'gulp'

export const withTaskName = <T extends TaskFunction>(displayName: string, fn: T) => assign(fn, { displayName })
