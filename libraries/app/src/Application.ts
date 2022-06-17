
import { Events } from '@helper/utils';

import Config from './Config';
import Router from './Router';
import HttpServer from './HttpServer';

import logger from './koa/logger';


class Application {
  readonly config: Config;
  readonly server: HttpServer;
  readonly events: Events;
  readonly routers: Array<Router> = [];
  readonly plugins: object = {};

  constructor(config: Config) {
    this.config = config;
    this.routers = [];
    this.plugins = {};

    this.events = new Events();
    this.server = new HttpServer(config);

    this.events.emit('init', this);
  }

  addRouter(router: Router) {
    this.routers.push(router);
  }

  addPlugin(name, plugin) {
    this.plugins[name] = plugin;
  }

  async start() {
    this.server.init();

    for (let index in this.routers) {
      const router = this.routers[index];
      await router.create(this);
    }

    for (let index in this.plugins) {
      const plugin = this.plugins[index];
      await plugin.init(this);
    }

    this.server.start(() => {
      logger.info('Server has been started on port: ' + this.config['port']);
      this.events.emit('start', this);
    });
  }
}

export default Application;
