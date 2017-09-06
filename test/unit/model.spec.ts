import * as assert from 'power-assert'
import { Model } from '../../src/model'

describe('Model', () => {
  it('should create an html name attribute value', () => {
    const model = new Model('user', 'value')
    assert(model.attrName('name') === 'user[name]')
  })

  it('should create an html id attribute value', () => {
    const model = new Model('user', 'value')
    assert(model.attrId('name') === 'user_name')
  })

  it('should return requested attribute of value', () => {
    const model = new Model('user', { name: 'foo' })
    assert(model.getAttr('name') === 'foo')
  })
})
