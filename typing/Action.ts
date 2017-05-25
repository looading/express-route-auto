import { Config }  from './config';


export interface Params {
  post?: string[],
  get? : string[],
  delete? : string[],
  all? : string[],
  put? : string[],
  head? : string[],
}

export class Action {
  /**
   * req.params -> express
   * ex: 
   *    parmas: {
   *      get: ['username', 'action']  
   *    }
   * =====>
   *    app.get('/:username/:action', (req, res, next) => {})
   * 
   */
  public params?: Params;
  constructor() {
    Action.prototype = new (Config.get())
  }
}

export interface Action {
  [propName: string]: any
}
