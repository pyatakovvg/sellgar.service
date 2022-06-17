

import Koa from 'koa';
import http, { Server } from 'http';
import bodyParser from 'koa-body';

import Config from './Config';
import cookie from './koa/cookie';
import errors from './koa/errors';

import { middleware as logger } from './koa/logger';


class HttpServer {
  readonly config: Config;
  readonly koa: Koa;
  readonly http: Server;

  constructor(config: Config) {
    this.config = config;

    this.koa = new Koa();
    this.http = http.createServer(this.koa.callback());
  }

  init() {

    this.koa.use(bodyParser({
      multipart: true,
      urlencoded: true,
      // enableTypes: ['json', 'form'],
      // onerror: (err, ctx) => {
      //   ctx.throw(422, 'body parse error');
      // }
    }));

    this.koa.use(logger());
    this.koa.use(cookie());
    this.koa.use(errors());
  }

  start(cb) {
    this.http.listen(this.config['port'], cb);
  }
}

export default HttpServer;
