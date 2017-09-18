import Vue, { VNodeDirective } from 'vue'
import { assign } from './utils'

type Subscriber = (value: any) => void

export class Model {
  constructor(
    readonly name: string,
    readonly value: any,
    private cb: Subscriber
  ) {
  }

  isMultiple(attr: string): boolean {
    return Array.isArray(this.value[attr])
  }

  input(attr: string, value: any): void {
    this.cb(assign({}, this.value, {
      [attr]: value
    }))
  }

  attrName(attr: string): string {
    const suffix = this.isMultiple(attr) ? '[]' : ''
    return this.name + '[' + attr + ']' + suffix
  }

  attrId(attr: string): string {
    return this.name + '_' + attr
  }

  getAttr(attr: string): any {
    return this.value[attr]
  }
}

export function createModel(name: string, value: any, cb: Subscriber): Model {
  return new Model(name, value, cb)
}
