import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

import consola from 'consola'

import { getPackageInfo } from '../pkg'

export const copy = async (source: string, destination: string) => {
  const pkgInfo = await getPackageInfo()

  const s = resolve(pkgInfo.dir, source)
  const d = resolve(pkgInfo.dir, destination)

  copyFileSync(s, d)
  consola.success('Copy success!')
  consola.info(`Source: ${s}`)
  consola.info(`Destination: ${d}`)
}
