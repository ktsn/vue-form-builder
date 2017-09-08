import {
  FunctionalComponentOptions,
  CreateElement,
  VNode,
  VNodeData
} from 'vue'

import { Model } from './model'
import { assert } from './utils'

type PropType<T> = { (): T } | { new (...args: any[]): T & object }

interface PropOptions<T> {
  type?: PropType<T> | PropType<T>[]
  required?: boolean;
  default?: T | null | undefined | (() => object);
  validator?(value: T): boolean;
}

interface HelperGeneratorContext<Props> {
  data: VNodeData
  model: Model
  props: Props
}

type HelperPropOptions<Props> = {
  [K in keyof Props]: PropOptions<Props[K]>
}

type HelperGenerator<Props> = (h: CreateElement, ctx: HelperGeneratorContext<Props>) => VNode

function createHelper<Props>(
  name: string,
  props: HelperPropOptions<Props>,
  generator: HelperGenerator<Props>
): FunctionalComponentOptions {
  return {
    name,
    functional: true,
    inject: ['formModel'],

    render(h, { data, props, injections }) {
      const model = injections.formModel as Model
      assert(model, `<${name}> must be used in the <form-for> slot`)
      return generator(h, {
        data,
        model,
        props
      })
    }
  }
}

const TextField = createHelper(
  'text-field',
  {
    for: {
      type: String,
      required: true
    }
  },
  (h, { data, props, model }) => {
    const name = props.for

    data.attrs = data.attrs || {}
    data.attrs.name = model.attrName(name)
    data.attrs.id = model.attrId(name)
    data.attrs.type = 'text'

    data.domProps = data.domProps || {}
    data.domProps.value = model.getAttr(name)

    return h('input', data)
  }
)

export const helpers: { [key: string]: FunctionalComponentOptions } = {
  TextField
}

// Temp fix
declare module 'vue/types/options' {
  interface FunctionalComponentOptions {
    inject?: ComponentOptions<any>['inject']
  }
}
