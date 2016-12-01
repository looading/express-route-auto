import expect from 'expect';
import assert from 'assert';
import _ from 'lodash';
import util from 'util';
import Action from '../controller/Action';

let req = {};
let res = {};
let next = () => {};


describe('extends Action', () => {
  class exe extends Action {
    constructor(){
      super();
    }

    post(){

    }

    get() {

    }
  }

  it('child should be a function', () => {
    assert.equal(true, _.isFunction(exe));
  })

  it('new exe should return a  method: post', () => {
    assert.equal(true, _.isFunction((new exe()).post));
  })

  it('new exe should return a  method: get', () => {
    assert.equal(true, _.isFunction((new exe()).get));
  })

  it('new exe should return a key:name', () => {
    assert.equal(true, _.isString((new exe()).name));
  })


});
