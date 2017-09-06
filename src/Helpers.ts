import { FunctionalComponentOptions } from 'vue'
import { Model } from './model'
import { assert } from './utils'

const TextField: FunctionalComponentOptions = {
  name: 'text-field',
  functional: true,

  render (h, { data, injections }) {
    const model = injections.formModel as Model
    assert(model, '<text-field> must be used in the <form-for> slot')

    const attrs = data.attrs!

    const name = attrs.for
    delete attrs.for

    attrs.name = model.attrName(name)
    attrs.id = model.attrId(name)
    attrs.type = 'text'

    return h('input', data)
  }
}

export const helpers: { [key: string]: FunctionalComponentOptions } = {
  TextField
}