import { isFunction } from './is'

export const result = <T>(object: any, path: string, defaultValue?: T | ((...args: any[]) => T)) => {
  let res = path.split('.').reduce((object, key) => (key === '' ? object : object[key]), object)
  return res || (isFunction(defaultValue) ? defaultValue(object) : defaultValue)
}
