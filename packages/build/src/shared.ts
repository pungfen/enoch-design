export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isArray = (val: unknown): val is Array<any> => toTypeString(val) === '[object Array]'
