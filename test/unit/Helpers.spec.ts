import * as assert from 'power-assert'
import Vue, { ComponentOptions } from 'vue'
import { mount, Wrapper } from 'vue-test-utils'
import FormFor from '../../src/FormFor'
import { helpers } from '../../src/Helpers'

interface Root extends Vue {
  user: {
    name: string
    age: number
    gender: string
    email: string
    url: string
    phone: string
    query: string
    password: string
    favoriteColor: string
    month: string
    week: string
    date: string
    datetime: string
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
          age: 20,
          gender: 'male',
          email: 'bar@example.com',
          url: 'https://example.com',
          phone: '090-1234-5678',
          query: 'query',
          password: 'password123',
          favoriteColor: '#0000ff',
          month: '2017-01',
          week: '2017-W01',
          date: '2017-01-01',
          datetime: '2017-01-01T08:30'
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

function assertAttrs(wrapper: Wrapper<Vue>, selector: string, type: string | null, attr: string): void {
  const input = wrapper.find(selector)
  if (type) {
    assert(input.hasAttribute('type', type))
  }
  assert(input.hasAttribute('name', `user[${attr}]`))
  assert(input.hasAttribute('id', `user_${attr}`))
}

function assertValue(wrapper: Wrapper<Vue>, selector: string, value: string): void {
  const el = q(wrapper, selector)
  assert(el.value === value)
}

function inputValue(wrapper: Wrapper<Vue>, selector: string, value: string): void {
  q(wrapper, selector).value = value
  wrapper.find(selector).trigger('input')
}

function changeSelect(wrapper: Wrapper<Vue>, selector: string, value: string | string[]): void {
  if (typeof value === 'string') {
    value = [value]
  }
  const select = q(wrapper, selector)
  Array.from<HTMLOptionElement>(select.options).forEach(option => {
    option.selected = value.indexOf(option.value) >= 0
  })
  wrapper.find(selector).trigger('change')
}

describe('Helpers', () => {
  describe('text-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<text-field for="name"></text-field>`))

      assertAttrs(wrapper, 'input', 'text', 'name')
      assertValue(wrapper, 'input', 'foo')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<text-field for="name"></text-field>`))

      assertValue(wrapper, 'input', 'foo')
      wrapper.vm.user.name = 'bar'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'bar')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
        <text-field for="name" class="a"></text-field>
        <text-field for="name" class="b"></text-field>
      `))

      assert(wrapper.vm.user.name === 'foo')
      assertValue(wrapper, '.a', 'foo')
      assertValue(wrapper, '.b', 'foo')

      inputValue(wrapper, '.a', 'bar')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.name === 'bar')
        assertValue(wrapper, '.a', 'bar')
        assertValue(wrapper, '.b', 'bar')
      })
    })
  })

  describe('number-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<number-field for="age"></number-field>`))

      assertAttrs(wrapper, 'input', 'number', 'age')
      assertValue(wrapper, 'input', '20')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<number-field for="age"></number-field>`))

      assertValue(wrapper, 'input', '20')
      wrapper.vm.user.age = 30
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '30')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<number-field for="age"></number-field>`))

      assert(wrapper.vm.user.age === 20)
      assertValue(wrapper, 'input', '20')

      inputValue(wrapper, 'input', '30')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.age === 30)
        assertValue(wrapper, 'input', '30')
      })
    })
  })

  describe('email-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<email-field for="email"></email-field>`))

      assertAttrs(wrapper, 'input', 'email', 'email')
      assertValue(wrapper, 'input', 'bar@example.com')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<email-field for="email"></email-field>`))

      assertValue(wrapper, 'input', 'bar@example.com')
      wrapper.vm.user.email = 'baz@example.com'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'baz@example.com')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<email-field for="email"></email-field>`))

      assert(wrapper.vm.user.email === 'bar@example.com')
      assertValue(wrapper, 'input', 'bar@example.com')

      inputValue(wrapper, 'input', 'baz@example.com')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.email === 'baz@example.com')
        assertValue(wrapper, 'input', 'baz@example.com')
      })
    })
  })

  describe('url-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<url-field for="url"></url-field>`))

      assertAttrs(wrapper, 'input', 'url', 'url')
      assertValue(wrapper, 'input', 'https://example.com')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<url-field for="url"></url-field>`))

      assertValue(wrapper, 'input', 'https://example.com')
      wrapper.vm.user.url = 'https://example.com/path'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'https://example.com/path')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<url-field for="url"></url-field>`))

      assert(wrapper.vm.user.url === 'https://example.com')
      assertValue(wrapper, 'input', 'https://example.com')

      inputValue(wrapper, 'input', 'https://example.com/path')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.url === 'https://example.com/path')
        assertValue(wrapper, 'input', 'https://example.com/path')
      })
    })
  })

  describe('tel-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<tel-field for="phone"></tel-field>`))

      assertAttrs(wrapper, 'input', 'tel', 'phone')
      assertValue(wrapper, 'input', '090-1234-5678')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<tel-field for="phone"></tel-field>`))

      assertValue(wrapper, 'input', '090-1234-5678')
      wrapper.vm.user.phone = '090-9876-5432'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '090-9876-5432')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<tel-field for="phone"></tel-field>`))

      assert(wrapper.vm.user.phone === '090-1234-5678')
      assertValue(wrapper, 'input', '090-1234-5678')

      inputValue(wrapper, 'input', '090-9876-5432')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.phone === '090-9876-5432')
        assertValue(wrapper, 'input', '090-9876-5432')
      })
    })
  })

  describe('search-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<search-field for="query"></search-field>`))

      assertAttrs(wrapper, 'input', 'search', 'query')
      assertValue(wrapper, 'input', 'query')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<search-field for="query"></search-field>`))

      assertValue(wrapper, 'input', 'query')
      wrapper.vm.user.query = 'updated query'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'updated query')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<search-field for="query"></search-field>`))

      assert(wrapper.vm.user.query === 'query')
      assertValue(wrapper, 'input', 'query')

      inputValue(wrapper, 'input', 'updated query')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.query === 'updated query')
        assertValue(wrapper, 'input', 'updated query')
      })
    })
  })

  describe('password-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<password-field for="password"></password-field>`))

      assertAttrs(wrapper, 'input', 'password', 'password')
      assertValue(wrapper, 'input', 'password123')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<password-field for="password"></password-field>`))

      assertValue(wrapper, 'input', 'password123')
      wrapper.vm.user.password = 'password567'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'password567')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<password-field for="password"></password-field>`))

      assert(wrapper.vm.user.password === 'password123')
      assertValue(wrapper, 'input', 'password123')

      inputValue(wrapper, 'input', 'password567')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.password === 'password567')
        assertValue(wrapper, 'input', 'password567')
      })
    })
  })

  describe('month-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<month-field for="month"></month-field>`))

      assertAttrs(wrapper, 'input', 'month', 'month')
      assertValue(wrapper, 'input', '2017-01')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<month-field for="month"></month-field>`))

      assertValue(wrapper, 'input', '2017-01')
      wrapper.vm.user.month = '2017-02'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '2017-02')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<month-field for="month"></month-field>`))

      assert(wrapper.vm.user.month === '2017-01')
      assertValue(wrapper, 'input', '2017-01')

      inputValue(wrapper, 'input', '2017-02')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.month === '2017-02')
        assertValue(wrapper, 'input', '2017-02')
      })
    })
  })

  describe('week-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<week-field for="week"></week-field>`))

      assertAttrs(wrapper, 'input', 'week', 'week')
      assertValue(wrapper, 'input', '2017-W01')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<week-field for="week"></week-field>`))

      assertValue(wrapper, 'input', '2017-W01')
      wrapper.vm.user.week = '2017-W02'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '2017-W02')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<week-field for="week"></week-field>`))

      assert(wrapper.vm.user.week === '2017-W01')
      assertValue(wrapper, 'input', '2017-W01')

      inputValue(wrapper, 'input', '2017-W02')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.week === '2017-W02')
        assertValue(wrapper, 'input', '2017-W02')
      })
    })
  })

  describe('datetime-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<datetime-field for="datetime"></datetime-field>`))

      assertAttrs(wrapper, 'input', 'datetime', 'datetime')
      assertValue(wrapper, 'input', '2017-01-01T08:30')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<datetime-field for="datetime"></datetime-field>`))

      assertValue(wrapper, 'input', '2017-01-01T08:30')
      wrapper.vm.user.datetime = '2017-04-20T10:15'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '2017-04-20T10:15')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<datetime-field for="datetime"></datetime-field>`))

      assert(wrapper.vm.user.datetime === '2017-01-01T08:30')
      assertValue(wrapper, 'input', '2017-01-01T08:30')

      inputValue(wrapper, 'input', '2017-04-20T10:15')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.datetime === '2017-04-20T10:15')
        assertValue(wrapper, 'input', '2017-04-20T10:15')
      })
    })
  })

  describe('datetime-local-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<datetime-local-field for="datetime"></datetime-local-field>`))

      assertAttrs(wrapper, 'input', 'datetime-local', 'datetime')
      assertValue(wrapper, 'input', '2017-01-01T08:30')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<datetime-local-field for="datetime"></datetime-local-field>`))

      assertValue(wrapper, 'input', '2017-01-01T08:30')
      wrapper.vm.user.datetime = '2017-04-20T10:15'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '2017-04-20T10:15')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<datetime-local-field for="datetime"></datetime-local-field>`))

      assert(wrapper.vm.user.datetime === '2017-01-01T08:30')
      assertValue(wrapper, 'input', '2017-01-01T08:30')

      inputValue(wrapper, 'input', '2017-04-20T10:15')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.datetime === '2017-04-20T10:15')
        assertValue(wrapper, 'input', '2017-04-20T10:15')
      })
    })
  })

  describe('date-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<date-field for="date"></date-field>`))

      assertAttrs(wrapper, 'input', 'date', 'date')
      assertValue(wrapper, 'input', '2017-01-01')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<date-field for="date"></date-field>`))

      assertValue(wrapper, 'input', '2017-01-01')
      wrapper.vm.user.date = '2017-12-12'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '2017-12-12')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<date-field for="date"></date-field>`))

      assert(wrapper.vm.user.date === '2017-01-01')
      assertValue(wrapper, 'input', '2017-01-01')

      inputValue(wrapper, 'input', '2017-12-12')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.date === '2017-12-12')
        assertValue(wrapper, 'input', '2017-12-12')
      })
    })
  })

  describe('color-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<color-field for="favoriteColor"></color-field>`))

      assertAttrs(wrapper, 'input', 'color', 'favoriteColor')
      assertValue(wrapper, 'input', '#0000ff')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<color-field for="favoriteColor"></color-field>`))

      assertValue(wrapper, 'input', '#0000ff')
      wrapper.vm.user.favoriteColor = '#aaccff'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '#aaccff')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<color-field for="favoriteColor"></color-field>`))

      assert(wrapper.vm.user.favoriteColor === '#0000ff')
      assertValue(wrapper, 'input', '#0000ff')

      inputValue(wrapper, 'input', '#aaccff')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.favoriteColor === '#aaccff')
        assertValue(wrapper, 'input', '#aaccff')
      })
    })
  })


  describe('range-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<range-field for="age"></range-field>`))

      assertAttrs(wrapper, 'input', 'range', 'age')
      assertValue(wrapper, 'input', '20')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<range-field for="age"></range-field>`))

      assertValue(wrapper, 'input', '20')
      wrapper.vm.user.age = 30
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', '30')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<range-field for="age"></range-field>`))

      assert(wrapper.vm.user.age === 20)
      assertValue(wrapper, 'input', '20')

      inputValue(wrapper, 'input', '30')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.age === 30)
        assertValue(wrapper, 'input', '30')
      })
    })
  })

  describe('hidden-field', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<hidden-field for="name"></hidden-field>`))

      assertAttrs(wrapper, 'input', 'hidden', 'name')
      assertValue(wrapper, 'input', 'foo')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<hidden-field for="name"></hidden-field>`))

      assertValue(wrapper, 'input', 'foo')
      wrapper.vm.user.name = 'bar'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'input', 'bar')
      })
    })
  })

  describe('select-field', () => {
    it('should be converted to select element', () => {
      const wrapper = mount(create(`
      <select-field for="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select-field>
      `))

      assertAttrs(wrapper, 'select', null, 'gender')
      assertValue(wrapper, 'select', 'male')

      assert(wrapper.findAll('option').length === 2)
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`
      <select-field for="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select-field>
      `))

      assertValue(wrapper, 'select', 'male')
      wrapper.vm.user.gender = 'female'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'select', 'female')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
      <select-field for="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select-field>
      `))

      assert(wrapper.vm.user.gender === 'male')
      assertValue(wrapper, 'select', 'male')

      changeSelect(wrapper, 'select', 'female')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.gender === 'female')
        assertValue(wrapper, 'select', 'female')
      })
    })
  })
})
