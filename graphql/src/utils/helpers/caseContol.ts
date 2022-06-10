
import { forOwn, camelCase, snakeCase, isPlainObject } from 'lodash'

/**
 * @description walk tree
 * @param {Object | Array} obj
 * @param {Function} cb - callback
 * @returns {Object | Array}
 */
function walk(obj: any, cb: Function): any {
  const x:any = Array.isArray(obj) ? [] : {};
  forOwn(obj, (v: any, k) => {
    // eslint-disable-next-line no-param-reassign
    if (isPlainObject(v) || Array.isArray(v)) v = walk(v, cb);
    x[cb(k)] = v;
  });

  return x;
}

export function toCamel<T>(obj: Object): T | undefined {
  if (!obj) return undefined;
  return walk(obj, (k: string) => camelCase(k));
};

export function toSnake<T>(obj: Object): T | undefined {
  if (!obj) return undefined;
  return walk(obj, (k: string) => snakeCase(k));
};