import * as assert from 'power-assert'
import { mount } from 'vue-test-utils'
import { Model } from '../../src/model'
import FormFor from '../../src/FormFor'

const Root = {
  template: `
    <form-for name="user" :model="user" action="/users" method="patch">
      <slot></slot>
    </form-for>
  `,
  data () {
    return {
      user: {
        name: 'foo',
        email: 'bar@example.com'
      }
    }
  },
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
      inject: ['formModel'],
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
    const model = (injectee.vm as any).formModel

    assert(model instanceof Model)
    assert.deepStrictEqual(model.value, (wrapper.vm as any).user)
    assert(model.name === 'user')
  })
})
