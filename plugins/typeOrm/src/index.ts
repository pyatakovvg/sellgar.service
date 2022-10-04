
import { Application, logger, Plugin } from '@library/app';

import fs from 'fs';
import path from 'path';
import { DataSource, EntityManager, Repository, ObjectLiteral, EntitySchema } from 'typeorm';

import 'reflect-metadata';
import * as console from "console";


interface IConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging?: boolean;
  modelsPath: string;
}

export interface IDbPlugin {
  config: IConfig;
  init(app: Application): void;
}

interface IModel {
  [key: string]: EntitySchema;
}


const defaultConfig = {
  logging: false,
};


class DbPlugin extends Plugin implements IDbPlugin {
  readonly config: any;

  private models: IModel = {};
  private instance: DataSource;


  constructor(config: IConfig) {
    super();

    this.config = {
      ...defaultConfig,
      ...config,
    };

    logger.info('DbTypeORMPlugin: create plugin');
  }

  async loadModels() {
    const modelsPath = this.config['modelsPath'];

    const files = fs.readdirSync(path.resolve(process.cwd(), modelsPath))
      .map((fileName) => {
        return {
          path: './' + modelsPath + '/' + fileName,
          name: fileName.replace(/\.[^/.]+$/, ""),
        }
      });

    for (let index in files) {
      if (files.hasOwnProperty(index)) {
        const file = files[index];
        const modelModule = await import(path.resolve(process.cwd(), file['path']));

        this.models[file['name']] = modelModule['default'];

        logger.debug(`DbTypeORMPlugin: добавлена модель: "${file['name']}"`);
      }
    }
  }

  get context(): DataSource {
    return this.instance;
  }

  get manager(): EntityManager {
    return this.instance.manager;
  }

  repository<T extends ObjectLiteral>(target: any): Repository<T> {
    return this.instance.getRepository<T>(target);
  }

  get model() {
    return this.models;
  }

  async init(app: Application): Promise<any> {
    try {
      await super.init(app);

      await this.loadModels();

      this.instance = new DataSource({
        type: "postgres",
        host: this.config['host'],
        port: this.config['port'],
        username: this.config['username'],
        password: this.config['password'],
        database: this.config['database'],
        synchronize: true,
        logging: this.config['logging'],
        entities: Object.keys(this.models).map((key: string) => this.models[key]),
        migrations: [],
        subscribers: [],
      });

      await this.instance.initialize();

      logger.info('DbTypeORMPlugin: initialized plugin');
      return Promise.resolve();
    }
    catch(error) {
      console.log(error)
      logger.error('DbTypeORMPlugin: ' + error['message']);
      return Promise.reject();
    }
  }
}

export * from 'typeorm';
export default DbPlugin;
