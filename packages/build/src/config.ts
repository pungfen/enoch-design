import { resolve } from 'path'
import { loadConfig } from 'unconfig'

import { isArray, isPlainObject } from './shared'
import type { Options } from 'tsup'

import type { PackageInfo } from './pkg'

type OptionalKey = 'name' | 'entry' | 'outDir' | 'minify' | 'format' | 'clean' | 'dts' | 'platform'

export interface UserInlineConfig extends Pick<Options, OptionalKey> {
  vue?: boolean
}

type UserInlineConfigResolved = Required<UserInlineConfig>

export const defineConfig = (config: UserInlineConfig) => {
  return config
}

const normalizeConfig = (pkgInfo: PackageInfo, config?: UserInlineConfig): UserInlineConfigResolved => {
  const normalized: UserInlineConfigResolved = {
    name: pkgInfo.manifest.name || '',
    entry: [pkgInfo.manifest.main || 'src/index.ts'],
    clean: true,
    outDir: 'dist',
    minify: false,
    format: ['esm'],
    dts: true,
    vue: false,
    ...config,
    platform: config?.vue ? 'browser' : config?.platform || 'node'
  }

  if (isArray(normalized.entry)) normalized.entry = normalized.entry.map((e) => resolve(pkgInfo.dir, e))
  else if (isPlainObject(normalized.entry)) {
    Object.entries(normalized.entry).forEach(([key, value]) => ((normalized.entry as Record<string, string>)[key] = resolve(pkgInfo.dir, value)))
  }

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
