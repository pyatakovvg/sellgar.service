
import { Application, logger, Plugin } from '@library/app';


class DbPlugin extends Plugin {
  constructor() {
    super();

    logger.info('DbPlugin: create plugin');
  }

  async init(app: Application): Promise<any> {
    try {
      await super.init(app);

      logger.info('DbPlugin: initialized plugin');
      return Promise.resolve();
    }
    catch(error) {
      logger.error('DbPlugin: ' + error['message']);
      return Promise.reject();
    }
  }
}

export default DbPlugin;
export { default as Image } from './Image';
