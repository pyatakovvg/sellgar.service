
import Application from './Application';


interface IConfig {
  [key: string]: any;
}


class Plugin {
  protected config: IConfig;
  protected app: Application;

  constructor(config: IConfig) {
    this.config = config;
  }

  async init(app: Application): Promise<any> {
    this.app = app;
    return Promise.resolve();
  }
}

export default Plugin;
