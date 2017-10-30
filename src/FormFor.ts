import Vue, { ComponentOptions } from 'vue'
import { createModel, Model } from './model'

export interface FormFor extends Vue {
  name: string,
  model: any,
  formModel: Model,
  onUpdate(value: any): void
}

const FormFor: ComponentOptions<FormFor> & ThisType<FormFor & Vue> = {
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

  model: {
    prop: 'model',
    event: 'input'
  },

  computed: {
    formModel() {
      return createModel(this.name, this.model, this.onUpdate)
    }
  },

  methods: {
    onUpdate(value: any): void {
      this.$emit('input', value)
    }
  },

  provide (this: FormFor) {
    return {
      getModel: () => this.formModel
    }
  },

  render (h) {
    return h('form', this.$slots.default)
  }
}

export default FormFor
