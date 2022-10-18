const objectToString = Object.prototype.toString

const toTypeString = (val: unknown): string => objectToString.call(val)

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const isArray = (val: unknown): val is Array<any> => toTypeString(val) === '[object Array]'

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object, Object]'

export const isFunction = (val: unknown): val is Function => typeof val === 'function'
