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
  props: Props,
  children: VNode[]
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
        props: this.$props,
        children: this.$slots.default
      })
    }
  }
}

function createInputHelper(
  name: string,
  type: string,
  getValue: (event: Event) => any = value
): ComponentOptions<Vue> {
  return createHelper(
    name,
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
          type,
          name: model.attrName(name),
          id: model.attrId(name)
        },
        domProps: {
          value: model.getAttr(name)
        },
        on: {
          input: model.createInputListener(name, getValue)
        }
      })
    }
  )
}

function value(event: Event): any {
  return (event.target as any).value
}

function number(event: Event): any {
  return Number(value(event))
}

const TextField = createInputHelper('text-field', 'text')
const NumberField = createInputHelper('number-field', 'number', number)
const EmailField = createInputHelper('email-field', 'email')
const UrlField = createInputHelper('url-field', 'url')
const TelField = createInputHelper('tel-field', 'tel')
const SearchField = createInputHelper('search-field', 'search')
const PasswordField = createInputHelper('password-field', 'password')
const MonthField = createInputHelper('month-field', 'month')
const WeekField = createInputHelper('week-field', 'week')
const DatetimeField = createInputHelper('datetime-field', 'datetime')
const DatetimeLocalField = createInputHelper('datetime-local-field', 'datetime-local')
const DateField = createInputHelper('date-field', 'date')
const TimeField = createInputHelper('time-field', 'time')
const ColorField = createInputHelper('color-field', 'color')
const RangeField = createInputHelper('range-field', 'range', number)
const HiddenField = createInputHelper('hidden-field', 'hidden')

const SelectField = createHelper(
  'select-field',
  {
    for: {
      type: String,
      required: true
    }
  },
  (h, { model, props, children }) => {
    const name = props.for

    return h('select', {
      attrs: {
        name: model.attrName(name),
        id: model.attrId(name)
      },
      domProps: {
        value: model.getAttr(name)
      },
      on: {
        input: model.createInputListener(name, value)
      }
    }, children)
  }
)

export const helpers: { [key: string]: ComponentOptions<Vue> } = {
  TextField,
  NumberField,
  EmailField,
  UrlField,
  TelField,
  SearchField,
  PasswordField,
  MonthField,
  WeekField,
  DatetimeField,
  DatetimeLocalField,
  DateField,
  TimeField,
  ColorField,
  RangeField,
  HiddenField,
  SelectField
}
