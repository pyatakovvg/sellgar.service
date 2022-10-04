
import { Application, logger, Plugin } from '@library/app';


export interface IDbPlugin {
  config: any;
  init(app: Application): void;
}


class DbPlugin extends Plugin implements IDbPlugin {
  readonly config: any;

  constructor(readonly instance: any) {
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
      console.log(error)
      logger.error('DbPlugin: ' + error['message']);
      return Promise.reject();
    }
  }
}

export default DbPlugin;
