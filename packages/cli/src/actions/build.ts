import consola from 'consola'
import { build as tsup } from 'tsup'

import { getUserConfig } from '../config'
import { getPackageInfo } from '../pkg'

interface BuildCommandOptions {
  showConfig?: boolean
}

export const build = async (options: BuildCommandOptions) => {
  try {
    const pkgInfo = await getPackageInfo()
    const userConfig = await getUserConfig(pkgInfo)

    if (options.showConfig) consola.log(userConfig)

    await tsup(userConfig)
  } catch (err) {
    consola.error(err)
  }
}
