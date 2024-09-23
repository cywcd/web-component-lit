const appliedClassMixins = new WeakMap<Constructor, unknown>();

/** Vefify if the Mixin was previously applyed
 * @private
 * @param {function} mixin      Mixin being applyed
 * @param {object} superClass   Class receiving the new mixin
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wasMixinPreviouslyApplied(mixin: any, superClass: any) {
  let klass = superClass;
  while (klass) {
    if (appliedClassMixins.get(klass) === mixin) {
      return true;
    }
    klass = Object.getPrototypeOf(klass);
  }
  return false;
}

type Constructor<T = {}> = new (...args: unknown[]) => T;

/**
 * Apply each mixin in the chain to make sure they are not applied more than once to the final class.
 * @param {function} mixin      Mixin to be applied
 * @returns {function}          Function to apply the mixin to a class
 */
export function dedupeMixin<T extends Constructor>(
  mixin: (superClass: T) => T
) {
  return (superClass: T): T => {
    if (wasMixinPreviouslyApplied(mixin, superClass)) {
      return superClass;
    }
    const mixedClass = mixin(superClass);
    appliedClassMixins.set(mixedClass, mixin);
    return mixedClass;
  };
}
