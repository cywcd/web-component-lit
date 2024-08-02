export const objectToString = Object.prototype.toString;

export const toTypeString = (val: unknown): string => objectToString.call(val);

export type Key = string | number | symbol;

export const isString = (obj: unknown): obj is string => toTypeString(obj) === '[object String]';

export const isPlainObject = (obj: unknown): obj is { [key: Key]: unknown } => toTypeString(obj) === '[object Object]';

export const isPlainArray = (obj: unknown): obj is unknown[] => toTypeString(obj) === '[object Array]';

export const isPlainRegExp = (obj: unknown): obj is RegExp => toTypeString(obj) === '[object RegExp]';

export const isBoolean = (obj: unknown): obj is boolean => toTypeString(obj) === '[object Boolean]';

export const isFunction = (obj: unknown): obj is (...agrn: unknown[]) => unknown => typeof obj === 'function';

export const isArrayEqual = (arr1: unknown[], arr2: unknown[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item, index) => item === arr2[index]);
};