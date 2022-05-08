import { series } from 'gulp'
import { clean, buildComponents, buildHooks } from './tasks'

export default series(clean, buildComponents, buildHooks)
