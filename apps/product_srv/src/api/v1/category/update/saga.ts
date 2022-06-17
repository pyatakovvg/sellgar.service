
import logger from '@package/logger';
import { InternalServerError } from '@package/errors';

import * as Sagas from 'node-sagas';

import { IParams } from './saga-params';


export default class Saga {
  parent = null;

  constructor(parent) {
    this.parent = parent;
  }

  async execute(params: IParams): Promise<IParams> {
    const saga = await this.getSagaDefinition();
    try {
      return await saga.execute(params);
    }
    catch (e) {
      if (e instanceof Sagas.SagaExecutionFailed) {
        throw new InternalServerError({ code: '100.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new InternalServerError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition(): Promise<any> {
    const body = this.parent.body;
    const db = this.parent.plugin.get('db');
    const sagaBuilder = new Sagas.SagaBuilder();

    const Category = db.models['Category'];


    return sagaBuilder
      .step('Get category')
      .invoke(async (params: IParams) => {
        logger.info('get category');

        const result = await Category.findOne({
          where: {
            uuid: body['uuid'],
          }
        });
        params.setItem(result);
      })
      .step('Update category')
      .invoke(async () => {
        logger.info('update category');

        await Category.update(body, {
          where: {
            uuid: body['uuid'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove category');

        const item = params.getItem();

        await Category.update(item, {
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Get result category')
      .invoke(async (params: IParams) => {
        logger.info('get result category');

        const item = params.getItem();
        const result = await Category.findOne({
          where: {
            uuid: item['uuid'],
          },
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
