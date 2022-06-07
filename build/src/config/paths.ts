import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')

export const pkgsRoot = resolve(projRoot, 'packages')
export const pkgComponentsRoot = resolve(pkgsRoot, 'components')
export const pkgDocsRoot = resolve(pkgsRoot, 'docs')
export const pkgHooksRoot = resolve(pkgsRoot, 'hooks')

export const componentsOutput = resolve(pkgComponentsRoot, 'dist')
export const docsOutput = resolve(pkgDocsRoot, 'dist')
export const hooksOutput = resolve(pkgHooksRoot, 'dist')
