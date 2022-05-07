import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..', '..')

export const pkgsRoot = resolve(projRoot, 'packages')
export const pkgComponentsRoot = resolve(pkgsRoot, 'components')

export const output = resolve(projRoot, 'dist')
export const componentsOutput = resolve(output, 'components')
