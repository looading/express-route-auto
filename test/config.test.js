import Config from '../config';
import expect from 'expect';
import assert from 'assert';
import _ from 'lodash';

let obj = {
  name: 'ctyloading',
  age: '19'
}
describe('Config.add',() => {

  it('should return a Object', () => {
    assert.equal(true , _.isObject(Config.add(obj)));
  })
  it('the value returned should be equal th origin', () => {
    assert.equal(obj.name , Config.add(obj).name);
  })
})

describe('Config.get',() => {
  it('should return a Object', () => {
    assert.equal(true , _.isObject(Config.get()));
  })
  it('the value returned should be equal th origin', () => {
    assert.equal(obj.name , Config.get().name);
  })
})
