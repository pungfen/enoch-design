import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')
export const output = resolve(projRoot, 'dist')
export const componentsOutput = resolve(output, 'components')

export const pkgsRoot = resolve(projRoot, 'packages')
export const pkgComponentsRoot = resolve(pkgsRoot, 'components')
export const pkgbuildRoot = resolve(pkgsRoot, 'components')
