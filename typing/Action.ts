import { Config }  from './config';

export class Action {
  constructor() {
    Action.prototype = new (Config.get())
  }
}

export interface Action {
  [propName: string]: any
}
