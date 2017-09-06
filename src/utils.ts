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
