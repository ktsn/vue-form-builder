import * as assert from 'power-assert'
import * as td from 'testdouble'
import Vue, { ComponentOptions } from 'vue'
import { mount } from 'vue-test-utils'
import { Model } from '../../src/model'
import FormFor from '../../src/FormFor'

interface Root extends Vue {
  user: any
}

function initialData() {
  return {
    user: {
      name: 'foo',
      email: 'bar@example.com'
    }
  }
}

const Root: ComponentOptions<Root> = {
  template: `
    <form-for name="user" :model="user" action="/users" method="patch">
      <slot></slot>
    </form-for>
  `,
  data: initialData,
  components: {
    FormFor
  }
}

describe('FormFor', () => {
  it('should be replaced with <form>', () => {
    const wrapper = mount(Root)

    assert(wrapper.is('form'))
    assert(wrapper.hasAttribute('action', '/users'))
    assert(wrapper.hasAttribute('method', 'patch'))
  })

  it('should provide model object', () => {
    const Injectee = {
      name: 'injectee',
      inject: ['getModel'],
      render (h: Function) {
        return h('p')
      }
    }

    const wrapper = mount(Root, {
      slots: {
        default: Injectee
      }
    })

    const injectee = wrapper.find(Injectee)
    const model = (injectee.vm as any).getModel()

    assert(model instanceof Model)
    assert.deepStrictEqual(model.value, wrapper.vm.user)
    assert(model.name === 'user')
  })

  it('should emit input event when the input field is updated', () => {
    const Injectee = {
      name: 'injectee',
      inject: ['getModel'],
      render (h: Function) {
        return h('p')
      }
    }

    const wrapper = mount(Root, {
      slots: {
        default: Injectee
      }
    })

    const injectee = wrapper.find<{ getModel: () => Model } & Vue>(Injectee)
    const onInput = td.function()
    wrapper.find(FormFor).vm.$on('input', onInput)

    injectee.vm.getModel().input('name', 'bar')

    // Should not update the model directly
    assert.deepStrictEqual(wrapper.vm.user, initialData().user)

    // Emit with updated object
    td.verify(
      onInput(Object.assign(initialData().user, {
        name: 'bar'
      }))
    )
  })
})
