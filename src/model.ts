import Vue, { VNodeDirective } from 'vue'
import { assign } from './utils'

export type Subscriber = (value: any) => void

export class Model {
  constructor(
    readonly name: string,
    private value: any,
    private cb: Subscriber
  ) {
  }

  isMultiple(attr: string): boolean {
    return Array.isArray(this.value[attr])
  }

  input(attr: string, value: any): void {
    this.value = assign({}, this.value, {
      [attr]: value
    })
    this.cb(this.value)
  }

  attrName(attr: string): string {
    const suffix = this.isMultiple(attr) ? '[]' : ''
    return this.name + '[' + attr + ']' + suffix
  }

  attrId(attr: string, value?: string): string {
    return this.name + '_' + attr + (value ? '_' + value : '')
  }

  getAttr(attr: string): any {
    return this.value[attr]
  }
}

export function createModel(name: string, value: any, cb: Subscriber): Model {
  return new Model(name, value, cb)
}
