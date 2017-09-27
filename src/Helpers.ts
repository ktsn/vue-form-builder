import Vue, {
  ComponentOptions,
  CreateElement,
  VNode,
  VNodeData,
  VNodeDirective
} from 'vue'

import { Model } from './model'
import { assert, toArray, looseIndexOf } from './utils'

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

const selectValueDirective = {
  bind: setSelected,
  componentUpdated: setSelected
}

// Borrowed from vue's v-model directive
function setSelected(el: HTMLSelectElement, binding: VNodeDirective): void {
  const multiple = el.multiple
  const value = binding.value

  for (let i = 0, len = el.options.length; i < len; i++) {
    const option = el.options[i]

    if (multiple) {
      const selected = looseIndexOf(value, option.value) > -1
      if (option.selected !== selected) {
        option.selected = selected
      }
    } else {
      if (option.value == value) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i
        }
        return
      }
    }
  }

  if (!multiple) {
    el.selectedIndex = -1
  }
}

function createHelper<Props>(
  name: string,
  props: HelperPropOptions<Props>,
  generator: HelperGenerator<Props>
): ComponentOptions<Vue & { getModel: () => Model }> {
  return {
    name,
    props: props as any,
    inject: ['getModel'],
    directives: {
      selectValue: selectValueDirective
    },

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
  getValueFn: (event: Event) => any = getValue
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
          input: createInputListener(model, name, getValueFn)
        }
      })
    }
  )
}


function createInputListener(
  model: Model,
  attr: string,
  getValue: (event: Event) => any
): (event: Event) => void {
  return event => {
    const value = getValue(event)
    model.input(attr, value)
  }
}

function createSelectListener(
  model: Model,
  attr: string
): (event: Event) => void {
  return event => {
    const el = event.target as HTMLSelectElement
    const selected = toArray(el.options)
      .filter(option => option.selected)
      .map(option => option.value)
    model.input(attr, el.multiple ? selected : selected[0])
  }
}

function getValue(event: Event): any {
  return (event.target as any).value
}

function getNumber(event: Event): any {
  return Number(getValue(event))
}

const TextField = createInputHelper('text-field', 'text')
const NumberField = createInputHelper('number-field', 'number', getNumber)
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
const RangeField = createInputHelper('range-field', 'range', getNumber)
const HiddenField = createInputHelper('hidden-field', 'hidden')

const RadioButton = createHelper(
  'radio-button',
  {
    for: {
      type: String,
      required: true
    },
    value: {
      type: null as any as { (): any },
      required: true
    }
  },
  (h, { model, props }) => {
    const { for: name, value } = props

    return h('input', {
      attrs: {
        type: 'radio',
        name: model.attrName(name),
        id: model.attrId(name, value)
      },
      domProps: {
        value,
        checked: model.getAttr(name) == value
      },
      on: {
        change: createInputListener(model, name, getValue)
      }
    })
  }
)

const CheckBox = createHelper(
  'check-box',
  {
    for: {
      type: String,
      required: true
    },
    value: {
      type: null as any as { (): any }
    },
    trueValue: {
      type: null as any as { (): any },
      default: true
    },
    falseValue: {
      type: null as any as { (): any },
      default: false
    }
  },
  (h, { model, props }) => {
    const { for: name, value, trueValue, falseValue } = props

    const checked = model.isMultiple(name)
      ? looseIndexOf(model.getAttr(name), value) > -1
      : model.getAttr(name) == trueValue

    const change = model.isMultiple(name)
      ? (event: Event) => {
        const { checked } = event.target as HTMLInputElement
        const modelValue = model.getAttr(name)
        const index = looseIndexOf(modelValue, value)

        if (checked) {
          if (index < 0) {
            model.input(name, modelValue.concat(value))
          }
        } else {
          if (index > -1) {
            const excluded = modelValue.slice(0, index)
              .concat(modelValue.slice(index + 1))
            model.input(name, excluded)
          }
        }
      }
      : (event: Event) => {
        const { checked } = event.target as HTMLInputElement
        model.input(name, checked ? trueValue : falseValue)
      }

    return h('input', {
      attrs: {
        type: 'checkbox',
        name: model.attrName(name),
        id: model.attrId(name, value)
      },
      domProps: {
        value,
        checked
      },
      on: {
        change
      }
    })
  }
)

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
        id: model.attrId(name),
        multiple: model.isMultiple(name)
      },
      on: {
        change: createSelectListener(model, name)
      },
      directives: [
        {
          name: 'selectValue',
          value: model.getAttr(name)
        } as VNodeDirective
      ]
    }, children)
  }
)

const TextArea = createHelper(
  'text-area',
  {
    for: {
      type: String,
      required: true
    }
  },
  (h, { model, props }) => {
    const name = props.for
    const modelValue = model.getAttr(name)

    return h('textarea', {
      attrs: {
        name: model.attrName(name),
        id: model.attrId(name)
      },
      domProps: {
        value: modelValue
      },
      on: {
        input: createInputListener(model, name, getValue)
      }
    }, modelValue)
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
  RadioButton,
  CheckBox,
  SelectField,
  // Avoid Vue's warning
  'text-area': TextArea
}
