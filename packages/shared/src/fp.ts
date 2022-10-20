export const result = <T>(object: any, path: string, defaultValue: T | ((...args: any[]) => T)) => {
  let res = path.split('.').reduce((parent, key) => (key === '' ? parent : parent[key]), object)
  console.log(res)

  return res
}
