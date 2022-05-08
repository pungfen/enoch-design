import rimraf from 'rimraf'

import { buildOutput } from '../config/paths'
import { withTaskName } from '../utils'

export const clean = withTaskName('clean', (done) => rimraf(buildOutput, done))
