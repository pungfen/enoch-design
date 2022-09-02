import { resolve } from 'path'
import { loadConfig } from 'unconfig'

import type { PackageInfo } from './pkg'

type Format = 'cjs' | 'esm' | 'iife'

export interface UserInlineConfig {
  name?: string
  entry?: string
  clean?: boolean
  outDir?: string
  minify?: boolean
  format?: Array<Format> | Format
  dts?: boolean
  version?: string
}

type UserInlineConfigResolved = Required<UserInlineConfig>

export const defineConfig = (config: UserInlineConfig) => {
  return config
}

const normalizeConfig = (pkgInfo: PackageInfo, config?: UserInlineConfig): UserInlineConfigResolved => {
  const normalized: UserInlineConfigResolved = {
    name: pkgInfo.manifest.name || '',
    entry: 'src/index.ts',
    clean: true,
    outDir: 'dist',
    minify: false,
    format: ['esm', 'cjs'],
    dts: true,
    version: '',
    ...config
  }

  normalized.entry = resolve(pkgInfo.dir, 'src/index.ts')
  normalized.outDir = resolve(pkgInfo.dir, 'dist')

  return normalized
}

export const getUserConfig = async (pkgInfo: PackageInfo): Promise<UserInlineConfigResolved> => {
  const { config } = await loadConfig<UserInlineConfig>({
    sources: [
      {
        files: 'build.config',
        extensions: ['ts']
      }
    ],
    cwd: pkgInfo.dir
  })
  return normalizeConfig(pkgInfo, config)
}
