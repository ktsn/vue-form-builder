import Vue, {
  ComponentOptions,
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
): ComponentOptions<Vue & { getModel: () => Model }> {
  return {
    name,
    props: props as any,
    inject: ['getModel'],

    render(h) {
      const model = this.getModel()
      assert(model, `<${name}> must be used in the <form-for> slot`)
      return generator(h, {
        model,
        props: this.$props
      })
    }
  }
}

function value(event: Event): any {
  return (event.target as any).value
}

const TextField = createHelper(
  'text-field',
  {
    for: {
      type: String,
      required: true
    }
  },
  (h, { props, model }) => {
    const name = props.for

    return h('input', {
      attrs: {
        type: 'text',
        name: model.attrName(name),
        id: model.attrId(name)
      },
      domProps: {
        value: model.getAttr(name)
      },
      on: {
        input: model.createInputListener(name, value)
      }
    })
  }
)

export const helpers: { [key: string]: ComponentOptions<Vue> } = {
  TextField
}
