import { resolve } from 'path'
import { loadConfig } from 'unconfig'

import type { Options } from 'tsup'

import type { PackageInfo } from './pkg'

type OptionalKey = 'name' | 'entry' | 'outDir' | 'minify' | 'format' | 'clean' | 'dts'

export interface UserInlineConfig extends Pick<Options, OptionalKey> {}

type UserInlineConfigResolved = Required<UserInlineConfig>

export const defineConfig = (config: UserInlineConfig) => {
  return config
}

const normalizeConfig = (pkgInfo: PackageInfo, config?: UserInlineConfig): UserInlineConfigResolved => {
  const normalized: UserInlineConfigResolved = {
    name: pkgInfo.manifest.name || '',
    entry: [],
    clean: true,
    outDir: 'dist',
    minify: false,
    format: ['esm', 'cjs'],
    dts: true,
    ...config
  }

  if (isFunction) normalized.entry = [resolve(pkgInfo.dir, 'src/index.ts')]
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
