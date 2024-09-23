import {isPlainArray, isPlainObject, isString} from './commonBase';

export const PREFIX = 'yc';

function filterRealKey(
  obj: string[] | {[key: string]: any}
): string[] | {[key: string]: any} {
  if (isPlainObject(obj)) {
    return Object.keys(obj).filter((value) => Boolean(obj[value]));
  }
  return obj;
}

/**
 *
 * namespace.join('grid') ===> 'yc-grid'
 * namespace.join('grid', 'item') ===> 'yc-grid yc-grid-item'
 * namespace.join('grid', ['content']) ===> 'yc-grid yc-grid-content'
 * namespace.join('grid', { s1: true, s2: false, s3: '', s4: '1231', s5: ['1231'] } )
 *           ===> 'yc-grid yc-grid-s1 yc-grid-s4 yc-grid-s5'
 *
 * @param name
 * @param mods
 * @returns {string|*}
 */

export function join(name: string, mods?: unknown): string;
export function join(name: string, mods: string): string;
export function join(name: string, mods: string[]): string;
export function join(name: string, mods: Record<string, any>): string;
export function join(name: string, mods: Record<string, any>[]): string;
export function join(name: string, mods: any) {
  const arr = [PREFIX, name];
  let ret;

  if (!mods) {
    return arr.join('-');
  }

  if (isString(mods)) {
    ret = arr.concat(mods).join('-');
  }

  if (isPlainObject(mods)) {
    const array = filterRealKey(mods);
    const res = array.map((mod: ConcatArray<string>) =>
      arr.concat(mod).join('-')
    );
    ret = res.join(' ');
  }

  if (isPlainArray(mods)) {
    mods = mods.reduce((prev, cur) => {
      if (isString(cur)) {
        (prev as unknown[]).push(arr.concat(cur).join('-'));
      }
      if (isPlainObject(cur)) {
        const r = filterRealKey(cur);
        const l = r.map((i: ConcatArray<string>) => arr.concat(i).join('-'));
        prev = (prev as unknown[]).concat(l);
      }
      return prev;
    }, []);

    ret = mods.join(' ');
  }

  return [arr.join('-'), ret].filter(Boolean).join(' ');
}

/**
 *
 * namespace.join('grid') ===> ''
 * namespace.join('grid', 'item') ===> 'yc-grid-item'
 * namespace.join('grid', ['content']) ===> 'yc-grid-content'
 * namespace.join('grid', { s1: true, s2: false, s3: '', s4: '1231', s5: ['1231'] } )
 *           ===> 'yc-grid-s1 yc-grid-s4 yc-grid-s5'
 *
 * @param name
 * @param mods
 * @returns {string|*}
 */
export function handle(name: string, mod?: unknown): string;
export function handle(name: string, mod: string): string;
export function handle(name: string, mods: string[]): string;
export function handle(name: string, mods: Record<string, any>): string;
export function handle(name: string, mods: Record<string, any>[]): string;
export function handle(name: string, mods: unknown): string {
  const arr = [PREFIX, name];

  if (!mods) {
    return '';
  }

  if (isString(mods)) {
    return arr.concat(mods).join('-');
  }

  if (isPlainObject(mods)) {
    const array = filterRealKey(mods);
    const res = array.map((mod: ConcatArray<string>) =>
      arr.concat(mod).join('-')
    );
    return res.join(' ');
  }

  if (isPlainArray(mods)) {
    const array = mods.reduce((prev: unknown[], cur) => {
      if (isString(cur)) {
        (prev as unknown[]).push(arr.concat(cur).join('-'));
      }
      if (isPlainObject(cur)) {
        const r = filterRealKey(cur);
        const l = r.map((i: ConcatArray<string>) => arr.concat(i).join('-'));
        prev = (prev as unknown[]).concat(l);
      }
      return prev;
    }, []);
    return (array as unknown[]).join(' ');
  }

  return '';
}
