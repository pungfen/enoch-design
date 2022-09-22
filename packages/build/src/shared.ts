export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isArray = (val: unknown): val is Array<any> => toTypeString(val) === '[object Array]'
