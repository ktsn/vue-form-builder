import * as assert from 'power-assert'
import Vue, { ComponentOptions } from 'vue'
import { mount, Wrapper } from 'vue-test-utils'
import FormFor from '../../src/FormFor'
import { helpers } from '../../src/Helpers'

interface Root extends Vue {
  user: {
    name: string
    email: string
  }
}

function create(slot: string): ComponentOptions<Root> {
  return {
    template: `
      <form-for name="user" v-model="user" action="/users" method="patch">
        ${slot}
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
      FormFor,
      ...helpers
    }
  }
}

function q(wrapper: Wrapper<Vue>, selector: string): any {
  return wrapper.vm.$el.querySelector(selector)!
}

describe('Helpers', () => {
  describe('text-field', () => {
    it('should be converted to input:text', () => {
      const wrapper = mount(create(`<text-field for="name"></text-field>`))

      const input = wrapper.find('input')
      assert(input.hasAttribute('name', 'user[name]'))
      assert(input.hasAttribute('id', 'user_name'))

      const el = q(wrapper, 'input')
      assert(el.value === 'foo')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<text-field for="name"></text-field>`))

      assert(q(wrapper, 'input').value === 'foo')
      wrapper.vm.user.name = 'bar'
      return Vue.nextTick().then(() => {
        assert(q(wrapper, 'input').value === 'bar')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
        <text-field for="name" class="a"></text-field>
        <text-field for="name" class="b"></text-field>
      `))

      assert(wrapper.vm.user.name === 'foo')
      assert(q(wrapper, '.a').value === 'foo')
      assert(q(wrapper, '.b').value === 'foo')

      q(wrapper, '.a').value = 'bar'
      wrapper.find('.a').trigger('input')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.name === 'bar')
        assert(q(wrapper, '.a').value === 'bar')
        assert(q(wrapper, '.b').value === 'bar')
      })
    })
  })
})