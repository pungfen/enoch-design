const objectToString = Object.prototype.toString

const toTypeString = (val: unknown): string => objectToString.call(val)

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const isArray = (val: any): val is Array<any> => toTypeString(val) === '[object Array]'

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isNull = (val: unknown): val is null => toTypeString(val) === '[object Null]'

export const isUndefined = (val: unknown): val is undefined => toTypeString(val) === '[object Undefined]'

export const isIntegerKey = (key: unknown) => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => hasOwnProperty.call(val, key)
