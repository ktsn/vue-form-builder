import * as assert from 'power-assert'
import { mount } from 'vue-test-utils'
import FormFor from '../../src/FormFor'
import { helpers } from '../../src/Helpers'

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

function slot(template: string) {
  return {
    default: {
      components: helpers,
      template
    }
  }
}

describe('Helpers', () => {
  describe('text-field', () => {
    it('should be converted to input:text', () => {
      const wrapper = mount(Root, {
        slots: slot(`
          <text-field for="name"></text-field>
        `)
      })

      const input = wrapper.find('input')
      assert(input.hasAttribute('name', 'user[name]'))
      assert(input.hasAttribute('id', 'user_name'))

      const el = wrapper.vm.$el.querySelector('input')!
      assert(el.value === 'foo')
    })
  })
})