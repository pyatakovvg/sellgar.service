
import { Application, logger, Plugin } from '@library/app';

import path from 'path';

import {
  createConnection,
  createChanel,

  createQueue,
  createConsumer,

  createPublish,
  createExchange,
  bindQueueToExchange,
} from './api';
import { getFiles } from './utils';


interface IConfig {
  host: string;
  actionsPath?: string;
}

export interface IRabbitPlugin {
  config: any;
  init(app: Application): void;
}


class RabbitPlugin extends Plugin implements IRabbitPlugin {
  readonly config: any;
  rabbitChannel: any = null;
  rabbitConnection: any = null;

  constructor(config: IConfig) {
    super(config);

    logger.info('RabbitPlugin: create plugin');
  }

  private async connection(host: string) {
    this.rabbitConnection = await createConnection(host);
    this.rabbitChannel = await createChanel(this.rabbitConnection);
  }

  async sendCommand(queue, message, params) {
    return await createQueue(this.rabbitChannel, queue, message, params);
  }

  async consumer(queue, options, callback) {
    await createConsumer(this.rabbitChannel, queue, options, callback);
  }

  async sendEvent(exchange, message) {
    await createExchange(this.rabbitChannel, exchange);
    await createPublish(this.rabbitChannel, exchange, message);
  }

  async bindToExchange(queue, exchange, callback) {
    await createExchange(this.rabbitChannel, exchange);
    await createConsumer(this.rabbitChannel, queue, callback);
    await bindQueueToExchange(this.rabbitChannel, queue, exchange);
  }

  async init(app: Application): Promise<any> {
    try {
      await super.init(app);

      await this.connection(this.config['host']);

      if (this.config.actionsPath) {
        const actions = await getFiles(path.resolve(process.cwd(), this.config.actionsPath));
        for (let index in actions) {
          const module = await import(actions[index]);
          logger.debug('RabbitPlugin: load action "' + actions[index] + '"');
          await module['default'].call(null, this, app);
        }
      }

      logger.info('RabbitPlugin: initialized plugin');
      return Promise.resolve();
    }
    catch(error) {
      logger.error('RabbitPlugin: ' + error['message']);
      return Promise.reject();
    }
  }
}

export default RabbitPlugin;
