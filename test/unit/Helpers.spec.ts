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
    likes: string[]
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
    hasPhone: boolean
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
          likes: ['apple', 'orange'],
          email: 'bar@example.com',
          url: 'https://example.com',
          phone: '090-1234-5678',
          query: 'query',
          password: 'password123',
          favoriteColor: '#0000ff',
          month: '2017-01',
          week: '2017-W01',
          date: '2017-01-01',
          datetime: '2017-01-01T08:30',
          hasPhone: true
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

function qAll(wrapper: Wrapper<Vue>, selector: string): any[] {
  return Array.from(wrapper.vm.$el.querySelectorAll(selector))
}

function assertAttrs(
  wrapper: Wrapper<Vue>,
  selector: string,
  type: string | null,
  attr: string,
  multiple: boolean = false,
  value: any = ''
): void {
  const input = wrapper.find(selector)
  if (type) {
    assert(input.hasAttribute('type', type))
  }
  const suffixName = multiple ? '[]' : ''
  const suffixId = value ? '_' + value : ''
  assert(input.hasAttribute('name', `user[${attr}]${suffixName}`))
  assert(input.hasAttribute('id', `user_${attr}${suffixId}`))
}

function assertValue(wrapper: Wrapper<Vue>, selector: string, value: string): void {
  const el = q(wrapper, selector)
  assert(el.value === value)
}

function inputValue(wrapper: Wrapper<Vue>, selector: string, value: string): void {
  q(wrapper, selector).value = value
  wrapper.find(selector).trigger('input')
}

function assertSelected(wrapper: Wrapper<Vue>, selector: string, value: string | string[]): void {
  if (typeof value === 'string') {
    value = [value]
  }
  const select = q(wrapper, selector)
  const selected = Array.from<HTMLOptionElement>(select.options).filter(option => {
    return option.selected
  }).map(option => {
    return option.value
  })

  assert.deepStrictEqual(selected.sort(), value.sort())
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

function assertChecked(wrapper: Wrapper<Vue>, selector: string, value: string | string[]): void {
  if (typeof value === 'string') {
    value = [value]
  }
  const checked = qAll(wrapper, selector).filter(el => {
    return el.checked
  }).map(el => {
    return el.value
  })

  assert.deepStrictEqual(checked.sort(), value.sort())
}

function changeCheck(wrapper: Wrapper<Vue>, selector: string, checked: boolean): void {
  q(wrapper, selector).checked = checked
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
      assertSelected(wrapper, 'select', 'male')

      assert(wrapper.findAll('option').length === 2)
    })

    it('should select single value if the value is not an array', () => {
      const wrapper = mount(create(`
      <select-field for="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select-field>
      `))

      assert(q(wrapper, 'select').multiple === false)
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`
      <select-field for="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select-field>
      `))

      assertSelected(wrapper, 'select', 'male')
      wrapper.vm.user.gender = 'female'
      return Vue.nextTick().then(() => {
        assertSelected(wrapper, 'select', 'female')
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
      assertSelected(wrapper, 'select', 'male')

      changeSelect(wrapper, 'select', 'female')

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.gender === 'female')
        assertSelected(wrapper, 'select', 'female')
      })
    })
  })

  describe('select-field (multiple)', () => {
    it('should be converted to select element', () => {
      const wrapper = mount(create(`
      <select-field for="likes">
        <option value="apple">Apple</option>
        <option value="orange">Orange</option>
        <option value="banana">Banana</option>
      </select-field>
      `))

      assertAttrs(wrapper, 'select', null, 'likes', true)
      assertSelected(wrapper, 'select', ['apple', 'orange'])

      assert(wrapper.findAll('option').length === 3)
    })

    it('should select multiple value if the value is an array', () => {
      const wrapper = mount(create(`
      <select-field for="likes">
        <option value="apple">Apple</option>
        <option value="orange">Orange</option>
        <option value="banana">Banana</option>
      </select-field>
      `))

      assert(q(wrapper, 'select').multiple === true)
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`
      <select-field for="likes">
        <option value="apple">Apple</option>
        <option value="orange">Orange</option>
        <option value="banana">Banana</option>
      </select-field>
      `))

      assertSelected(wrapper, 'select', ['apple', 'orange'])
      wrapper.vm.user.likes = ['apple', 'banana']
      return Vue.nextTick().then(() => {
        assertSelected(wrapper, 'select', ['apple', 'banana'])
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
      <select-field for="likes">
        <option value="apple">Apple</option>
        <option value="orange">Orange</option>
        <option value="banana">Banana</option>
      </select-field>
      `))

      assert.deepEqual(wrapper.vm.user.likes, ['apple', 'orange'])
      assertSelected(wrapper, 'select', ['apple', 'orange'])

      changeSelect(wrapper, 'select', ['apple', 'banana'])

      return Vue.nextTick().then(() => {
        assert.deepEqual(wrapper.vm.user.likes, ['apple', 'banana'])
        assertSelected(wrapper, 'select', ['apple', 'banana'])
      })
    })
  })

  describe('radio-button', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`
        <radio-button for="gender" value="male"></radio-button>
        <radio-button for="gender" value="female"></radio-button>
      `))

      const r1 = q(wrapper, 'input:nth-child(1)')
      assert(r1.type === 'radio')
      assert(r1.name === 'user[gender]')
      assert(r1.id === 'user_gender_male')
      assert(r1.value === 'male')

      const r2 = q(wrapper, 'input:nth-child(2)')
      assert(r2.type === 'radio')
      assert(r2.name === 'user[gender]')
      assert(r2.id === 'user_gender_female')
      assert(r2.value === 'female')

      assertChecked(wrapper, 'input', 'male')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`
        <radio-button for="gender" value="male"></radio-button>
        <radio-button for="gender" value="female"></radio-button>
      `))

      assertChecked(wrapper, 'input', 'male')
      wrapper.vm.user.gender = 'female'
      return Vue.nextTick().then(() => {
        assertChecked(wrapper, 'input', 'female')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
        <radio-button for="gender" value="male"></radio-button>
        <radio-button for="gender" value="female"></radio-button>
      `))

      assert(wrapper.vm.user.gender === 'male')
      assertChecked(wrapper, 'input', 'male')

      changeCheck(wrapper, 'input:nth-child(2)', true)

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.gender === 'female')
        assertChecked(wrapper, 'input', 'female')
      })
    })
  })

  describe('check-box (single)', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`<check-box for="hasPhone"></check-box>`))

      assertAttrs(wrapper, 'input', 'checkbox', 'hasPhone')
      const checkbox = q(wrapper, 'input')
      assert(checkbox.checked === true)
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<check-box for="hasPhone"></check-box>`))

      const checkbox = q(wrapper, 'input')
      assert(checkbox.checked === true)
      wrapper.vm.user.hasPhone = false
      return Vue.nextTick().then(() => {
        assert(checkbox.checked === false)
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`<check-box for="hasPhone"></check-box>`))

      const checkbox = q(wrapper, 'input')

      assert(wrapper.vm.user.hasPhone === true)
      assert(checkbox.checked === true)

      changeCheck(wrapper, 'input', false)

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.hasPhone === false)
        assert(checkbox.checked === false)
      })
    })

    it('should be specified true value and false value', () => {
      const wrapper = mount(create(
        `<check-box for="gender" true-value="male" false-value="female"></check-box>`
      ))

      const checkbox = q(wrapper, 'input')
      assert(wrapper.vm.user.gender === 'male')
      assert(checkbox.checked === true)

      // Update model
      wrapper.vm.user.gender = 'female'

      return Vue.nextTick().then(() => {
        assert(wrapper.vm.user.gender === 'female')
        assert(checkbox.checked === false)

        // Update checkbox
        changeCheck(wrapper, 'input', true)

        return Vue.nextTick()
      }).then(() => {
        assert(wrapper.vm.user.gender === 'male')
        assert(checkbox.checked === true)
      })
    })
  })

  describe('check-box (multiple)', () => {
    it('should be converted to input element', () => {
      const wrapper = mount(create(`
      <check-box for="likes" value="apple"></check-box>
      <check-box for="likes" value="orange"></check-box>
      <check-box for="likes" value="banana"></check-box>
      `))

      assertAttrs(wrapper, 'input:nth-child(1)', 'checkbox', 'likes', true, 'apple')
      assertAttrs(wrapper, 'input:nth-child(2)', 'checkbox', 'likes', true, 'orange')
      assertAttrs(wrapper, 'input:nth-child(3)', 'checkbox', 'likes', true, 'banana')
      assertChecked(wrapper, 'input', ['apple', 'orange'])
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`
      <check-box for="likes" value="apple"></check-box>
      <check-box for="likes" value="orange"></check-box>
      <check-box for="likes" value="banana"></check-box>
      `))

      assertChecked(wrapper, 'input', ['apple', 'orange'])
      wrapper.vm.user.likes = ['apple', 'banana']
      return Vue.nextTick().then(() => {
        assertChecked(wrapper, 'input', ['apple', 'banana'])
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
      <check-box for="likes" value="apple"></check-box>
      <check-box for="likes" value="orange"></check-box>
      <check-box for="likes" value="banana"></check-box>
      `))

      assert.deepEqual(wrapper.vm.user.likes, ['apple', 'orange'])
      assertChecked(wrapper, 'input', ['apple', 'orange'])

      changeCheck(wrapper, 'input:nth-child(3)', true)
      changeCheck(wrapper, 'input:nth-child(2)', false)

      return Vue.nextTick().then(() => {
        assert.deepEqual(wrapper.vm.user.likes, ['apple', 'banana'])
        assertChecked(wrapper, 'input', ['apple', 'banana'])
      })
    })
  })

  describe('text-area', () => {
    it('should be converted to textarea element', () => {
      const wrapper = mount(create(`<text-area for="name"></text-area>`))

      assertAttrs(wrapper, 'textarea', null, 'name')
      assertValue(wrapper, 'textarea', 'foo')

      const el = q(wrapper, 'textarea')
      assert(el.textContent === 'foo')
    })

    it('should update its value with changing model', () => {
      const wrapper = mount(create(`<text-area for="name"></text-area>`))

      assertValue(wrapper, 'textarea', 'foo')
      wrapper.vm.user.name = 'bar'
      return Vue.nextTick().then(() => {
        assertValue(wrapper, 'textarea', 'bar')
      })
    })

    it('should update model with the input event from the field', () => {
      const wrapper = mount(create(`
        <text-area for="name" class="a"></text-area>
        <text-area for="name" class="b"></text-area>
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

  describe('field-label', () => {
    it('should add an appropriate "for" attribute', () => {
      const wrapper = mount(create(`<field-label for="name">Label</field-label>`))

      const label = wrapper.find('label')
      assert(label.hasAttribute('for', 'user_name'))
      assert(label.text() === 'Label')
    })

    it('should add suffix when specified fieldValue prop', () => {
      const wrapper = mount(create(`<field-label for="likes" field-value="apple">apple</field-label>`))

      const label = wrapper.find('label')
      assert(label.hasAttribute('for', 'user_likes_apple'))
    })
  })
})
