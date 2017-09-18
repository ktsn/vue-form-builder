export const assign: typeof Object.assign = Object.assign || ((target: object, ...sources: any[]) => {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      (target as any)[key] = source[key]
    })
  })
  return target
})

export function assert(condition: any, message: string): void {
  if (!condition) {
    throw new Error('[vue-form-builder] ' + message)
  }
}

export function toArray<T>(arrayLike: ArrayLike<T>): T[] {
  return Array.prototype.slice.call(arrayLike)
}

export function looseIndexOf<T>(list: T[], value: T): number {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i] == value) {
      return i
    }
  }
  return -1
}
