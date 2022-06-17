
import { Context } from 'koa';

import Plugin from './Plugin';
import Application from './Application';


class Controller {
  protected _ctx: Context;
  protected _body: any;
  protected _cookie: any;
  protected _query: object;
  protected _params: object;
  protected _headers: object;
  protected readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init(ctx: Context) {
    this._ctx = ctx;
    this._params = ctx['params'];
    this._cookie = ctx['cookies'];
    this._headers = ctx['headers'];
    this._body = ctx['request']['body'];
    this._query = ctx['request']['query'];
  }

  get plugin() {
    const app = this.app;
    return {
      get(name: string): Plugin {
        return app.plugins[name];
      }
    };
  }

  public get ctx(): Context {
    return this._ctx;
  }

  public get body() {
    return this._body;
  }

  public get query() {
    return this._query;
  }

  public get cookie() {
    return this._cookie;
  }

  public get headers() {
    return this._headers;
  }

  public get params() {
    return this._params;
  }

  async send(): Promise<any> {
    throw new Error('Method "send" mast be reloaded in controller');
  }
}

export default Controller;
