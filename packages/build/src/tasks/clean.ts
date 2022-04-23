import rimraf from 'rimraf'

import { output } from '../config/paths'
import { withTaskName } from '../utils'

export const clean = withTaskName('clean', (done) => rimraf(output, done))
