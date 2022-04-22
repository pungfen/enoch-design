import { series, parallel } from 'gulp'
import { buildComponents } from './tasks/build-components'

export default series(buildComponents)
