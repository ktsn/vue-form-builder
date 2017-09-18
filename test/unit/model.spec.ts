import * as assert from 'power-assert'
import { Model } from '../../src/model'

describe('Model', () => {
  const noop = () => {}

  it('should create an html name attribute value', () => {
    const model = new Model('user', 'value', noop)
    assert(model.attrName('name') === 'user[name]')
  })

  it('should create an html id attribute value', () => {
    const model = new Model('user', 'value', noop)
    assert(model.attrId('name') === 'user_name')
  })

  it('should return requested attribute of value', () => {
    const model = new Model('user', { name: 'foo' }, noop)
    assert(model.getAttr('name') === 'foo')
  })

  it('should return true if the attr can be specify multi-values', () => {
    const model = new Model('user', {
      likes: ['video', 'music'],
      name: 'foo'
    }, noop)

    assert(model.isMultiple('likes') === true)
    assert(model.isMultiple('name') === false)
  })
})
