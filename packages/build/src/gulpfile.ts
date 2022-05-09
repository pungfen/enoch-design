import { series } from 'gulp'
import { buildComponents, buildHooks, buildDocs } from './tasks'

export default series(buildComponents, buildHooks, buildDocs)
