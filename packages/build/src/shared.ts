import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { pathToFileURL, fileURLToPath } from 'url'
import consola from 'consola'

import { type BuildConfig } from './build-config'
import { execaSync } from 'execa'

export const BUILD_CONFIG_FILE_NAME = 'build.config.ts'

export const findRootDir = (dir: string): string => {
  if (existsSync(join(dir, BUILD_CONFIG_FILE_NAME))) return dir
  if (dir === dirname(dir)) return dir
  return findRootDir(dir)
}

export const CWD = process.cwd()
export const ROOT = findRootDir(CWD)
export const SRC_DIR = join(ROOT, 'src')
export const ES_DIR = join(ROOT, 'es')
export const LIB_DIR = join(ROOT, 'lib')
export const BUILD_CONFIG_FILE = join(ROOT, BUILD_CONFIG_FILE_NAME)
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json')

const __dirname = dirname(fileURLToPath(import.meta.url))
export const DIST_DIR = join(__dirname, '..', '..', 'dist')

export const getPackageJson = () => JSON.parse(readFileSync(PACKAGE_JSON_FILE, 'utf-8'))

export const getBuildConfigAsync = async (): Promise<Partial<BuildConfig>> => {
  try {
    return (await import(pathToFileURL(BUILD_CONFIG_FILE).href)).default
  } catch (err) {
    return {}
  }
}

const buildConfig = await getBuildConfigAsync()

const normalizedbuildConfig = (config: Partial<BuildConfig>): BuildConfig => {
  return Object.assign({}, config, {
    build: Object.assign(config.build, {
      packageManager: 'pnpm'
    })
  })
}

export const getBuildConfig = () => normalizedbuildConfig(buildConfig)

const getPackageManager = () => {
  const { build } = getBuildConfig()
  if (build.packageManager) return build?.packageManager
}

export const installDependencies = async () => {
  consola.info('Install Dependencies\n')
  try {
    const manager = getPackageManager()
    execaSync(manager, ['install', '--prod=false'], { stdio: 'inherit' })
    consola.log('')
  } catch (err) {
    consola.log(err)
    throw err
  }
}
