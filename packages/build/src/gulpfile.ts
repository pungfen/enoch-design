import { series } from 'gulp'
import { buildComponents, buildHooks } from './tasks'

export default series(buildComponents, buildHooks)
