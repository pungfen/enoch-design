import { resolve } from 'path'
import { loadConfig } from 'unconfig'
import { isArray, isString, hasOwn } from '@enochfe/shared'

import type { PackageInfo } from './pkg'

export interface UserInlineConfig {
  entry?: string | string[]
  outDir?: string
  sourcemap?: boolean
  vue?: boolean
}

type UserInlineConfigResolved = Required<UserInlineConfig>

export const defineConfig = (config: UserInlineConfig) => {
  return config
}

const normalizeConfig = (pkgInfo: PackageInfo, config: UserInlineConfig = {}): UserInlineConfigResolved => {
  const normalized: UserInlineConfigResolved = {
    entry: config?.entry || [pkgInfo.manifest.main || 'src/index.ts'],
    vue: hasOwn(config, 'vue') ? config.vue! : false,
    outDir: config?.outDir || 'dist',
    sourcemap: hasOwn(config, 'sourcemap') ? config.sourcemap! : true
  }

  if (isString(normalized.entry)) {
    normalized.entry = resolve(pkgInfo.dir, normalized.entry)
  } else if (isArray(normalized.entry)) {
    normalized.entry = normalized.entry.map((e) => resolve(pkgInfo.dir, e))
  }

  normalized.outDir = resolve(pkgInfo.dir, normalized.outDir)

  return normalized
}

export const getUserConfig = async (pkgInfo: PackageInfo): Promise<UserInlineConfigResolved> => {
  const { config } = await loadConfig<UserInlineConfig>({
    sources: [{ files: 'build.config', extensions: ['ts'] }],
    cwd: pkgInfo.dir
  })

  return normalizeConfig(pkgInfo, config)
}
