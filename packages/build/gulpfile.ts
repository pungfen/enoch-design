import { series, parallel } from 'gulp'
import { withTaskName, runTask } from './src/gulp'
import { run } from './src/process'

export const buildComponents = async () => {
  console.log('xxxx')
}

export default series(
  withTaskName('clean', () => run('pnpm run clean'))
  // parallel(runTask('buildComponents'))
)
