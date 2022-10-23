import findWorkspaceDir from '@pnpm/find-workspace-dir'
import findWorkspacePackages from '@pnpm/find-workspace-packages'

import type { Project } from '@pnpm/find-workspace-packages'

export type PackageInfo = Project

export const getPackageInfo = async (): Promise<PackageInfo> => {
  const cwd = process.cwd()
  const pkg = await (findWorkspacePackages as any).default(cwd)
  if (!pkg) throw new Error("pkg doesn't exist!")
  const [info] = pkg
  return info
}
