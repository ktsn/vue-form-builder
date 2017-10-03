import _Vue, { ComponentOptions } from 'vue'
import { helpers } from './Helpers'
import FormFor from './FormFor'
import { assign } from './utils'

const FormBuilder = assign({
  FormFor
}, helpers)

export const FormBuilderMixin: ComponentOptions<_Vue> = {
  components: FormBuilder
}

export default function install(Vue: typeof _Vue) {
  Object.keys(FormBuilder).forEach(key => {
    const c = FormBuilder[key]
    Vue.component(c.name!, c)
  })
}

/* global window */
if (typeof window !== 'undefined' && typeof (window as any).Vue === 'function') {
  (window as any).Vue.use(install)
}
