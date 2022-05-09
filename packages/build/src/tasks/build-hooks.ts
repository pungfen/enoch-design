import { parallel, series } from 'gulp'
import rimraf from 'rimraf'

import { build } from 'vite'

import { docsOutput } from '../config'
import { withTaskName } from '../utils'

export const buildHooks = series(
  withTaskName('clean-components', (done) => rimraf(docsOutput, done)),
  parallel(async () => {})
)
