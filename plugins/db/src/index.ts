
import { Application, logger, Plugin } from '@library/app';

import fs from 'fs';
import path from 'path';
import Sq, { Sequelize, Model, DataTypes } from 'sequelize';


interface IConfig {
  host: string;
  modelsPath: string;
}

interface IModel {
  [key: string]: Model;
}

export interface IDbPlugin {
  config: any;
  models: any;
  _sequelize: Sequelize;
  loadModels(): void;
  createConnection(host: string): void;
  init(app: Application): void;
}


class DbPlugin extends Plugin implements IDbPlugin {
  readonly config: any;
  readonly models: IModel;
  _sequelize: Sequelize;

  constructor(config: IConfig) {
    super(config);

    this.models = {};

    logger.info('DbPlugin: create plugin');
  }

  createConnection(host: string) {
    this._sequelize = new Sq.Sequelize(host, {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 2000,
        idle: 1000
      },
    });
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

        this.models[file['name']] = modelModule['default']({
          sequelize: this.sequelize,
          Sequelize,
          DataTypes,
          Model,
        });

        logger.debug(`DB: добавлена модель: "${file['name']}"`);
      }
    }

    for (let index in this.models) {
      if (this.models.hasOwnProperty(index)) {
        const model = this.models[index];
        model['associate'] && model['associate'](this.models);
      }
    }

    await this.sequelize.sync();
  }

  get model() {
    const models = this.models;
    return {
      get(name: string): Model {
        const model = models[name] ?? null;

        if ( ! model) {
          throw Error('Модель "' + name + '" не найдена');
        }

        return model;
      }
    };
  }

  get sequelize() {
    return this._sequelize;
  }

  async init(app: Application): Promise<any> {
    try {
      await super.init(app);

      this.createConnection(this.config['host']);

      await this.sequelize.authenticate();
      await this.loadModels();

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
