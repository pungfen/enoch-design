import { resolve } from 'node:path'
import glob from 'fast-glob'

import { RollupToStringPlugin, rollupBuild } from '@enochfe/test-utils'
import Factory from '../src/rollup'

describe('Rollup', () => {
  describe('fixtures', async () => {
    const root = resolve(__dirname, '..')

    const files = await glob('tests/fixtures/*.vue', { cwd: root, onlyFiles: true })

    for (const file of files) {
      it(file.replace(/\\/g, '/'), async () => {
        const filepath = resolve(root, file)

        const code = await rollupBuild(filepath, [Factory(), RollupToStringPlugin()]).catch((err) => err)

        expect(code).toMatchSnapshot()
      })
    }
  })
})
