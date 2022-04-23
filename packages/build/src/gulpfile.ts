import { series } from 'gulp'
import { buildComponents, clean } from './tasks'

export default series(clean, buildComponents)
