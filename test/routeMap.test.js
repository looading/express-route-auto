import expect from 'expect';
import assert from 'assert';
import _ from 'lodash';
import util from 'util';
import path from 'path';
import { getModulesMap, formatMap } from '../controller/Generate';

let results = getModulesMap(path.join(__dirname, '../demo/controller'), '/')
describe('test getModulesMap', () => {
  it('iterat route dir: return a Array', () => {
    assert.equal(true, _.isArray(results))
  })
  it('iterat route dir || format: return a Object /', () => {
    assert.equal(true, _.isObject(formatMap(results)))
  })
})