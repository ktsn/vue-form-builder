import Vue, { ComponentOptions } from 'vue'
import { createModel } from './model'

export default {
  name: 'form-for',

  props: {
    name: {
      type: String,
      required: true
    },

    model: {
      type: Object,
      required: true
    }
  },

  provide (this: any) {
    return {
      formModel: createModel(this.name, this.model)
    }
  },

  render (h) {
    return h('form', this.$slots.default)
  }
} as ComponentOptions<Vue>
