interface BuildInlineConfig {}

export async function build(packageName: string, userConfig?: BuildInlineConfig) {
  const pkg = await getPackage(packageName)
}
