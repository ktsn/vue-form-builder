import { VNodeDirective } from 'vue'

export class Model {
  constructor(
    readonly name: string,
    readonly value: any
  ) {
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
}

export function createModel(name: string, value: any): Model {
  return new Model(name, value)
}
