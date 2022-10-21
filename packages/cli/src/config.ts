import { resolve } from 'path'
import { loadConfig } from 'unconfig'
import { isArray, isPlainObject, hasOwn } from '@enochfe/shared'

import type { Options } from 'tsup'

import type { PackageInfo } from './pkg'

type OptionalKey = 'entry' | 'outDir' | 'minify' | 'format' | 'clean' | 'dts' | 'platform'

export interface UserInlineConfig extends Pick<Options, OptionalKey> {
  vue?: boolean
}

type UserInlineConfigResolved = Required<UserInlineConfig>

export const defineConfig = (config: UserInlineConfig) => {
  return config
}

const normalizeConfig = (pkgInfo: PackageInfo, config: UserInlineConfig = {}): UserInlineConfigResolved => {
  const normalized: UserInlineConfigResolved = {
    clean: true,
    dts: hasOwn(config, 'dts') ? !!config.dts : true,
    entry: config?.entry || [pkgInfo.manifest.main || 'src/index.ts'],
    outDir: config?.outDir || 'dist',
    platform: config?.platform || 'node',
    minify: !config?.minify,
    format: config?.format || ['cjs', 'esm'],
    vue: false
  }

  if (isArray(normalized.entry)) {
    normalized.entry = normalized.entry.map((e) => resolve(pkgInfo.dir, e))
  }

  if (isPlainObject(normalized.entry)) {
    for (let e in normalized.entry) {
      // @ts-ignore
      normalized.entry[e] = resolve(pkgInfo.dir, normalized.entry[e])
    }
  }

  normalized.outDir = resolve(pkgInfo.dir, normalized.outDir)

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
