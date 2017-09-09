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

  input(attr: string, value: any): void {
    this.cb(assign({}, this.value, {
      [attr]: value
    }))
  }

  attrName(attr: string): string {
    return this.name + '[' + attr + ']'
  }

  attrId(attr: string): string {
    return this.name + '_' + attr
  }

  getAttr(attr: string): any {
    return this.value[attr]
  }

  createInputListener(
    attr: string,
    getValue: (event: Event) => any
  ): (event: Event) => void {
    return event => {
      const value = getValue(event)
      this.input(attr, value)
    }
  }
}

export function createModel(name: string, value: any, cb: Subscriber): Model {
  return new Model(name, value, cb)
}
