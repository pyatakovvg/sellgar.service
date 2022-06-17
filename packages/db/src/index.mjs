
import logger from '@package/logger';

import fs from 'fs';
import path from 'path';
import Sq from 'sequelize';


export let models = {};
export let sequelize = null;
export const Op = Sq.Op;


export const connection = async (host, { modelsPath }) => {
  try {
    logger['debug']('---=== DB: Создание соединения к базе данных ===---');

    sequelize = new Sq.Sequelize(host, {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 2000,
        idle: 1000
      },
    });

    logger['debug']('DB: Объект базы данных создан');

    await sequelize.authenticate();

    logger['debug']('DB: Подключение к базе данный прошло успешно');

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
        logger['debug'](`DB: добавлена модель: "${file['name']}"`);
        models[file['name']] = modelModule['default'](sequelize, Sq.DataTypes);
      }
    }

    for (let index in models) {
      if (models.hasOwnProperty(index)) {
        const model = models[index];
        model['associate'] && model['associate'](models);
      }
    }

    await sequelize.sync();

    logger['debug']('DB: Синхронизация моделей прошла успешно');
  }
  catch(error) {
    logger['error']('DB: ' + error['message']);
  }
}

export { Sequelize } from 'sequelize';
