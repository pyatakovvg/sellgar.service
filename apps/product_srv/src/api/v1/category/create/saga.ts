
import { InternalServerError } from '@package/errors';

import logger from '@package/logger';

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
        console.log(e)
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
      .step('Create category')
      .invoke(async (params: IParams) => {
        logger.info('create category');

        console.log(body)
        const result = await Category.create(body);
        params.setItem(result);
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove category');

        const item = params.getItem();
        await Category.destroy({
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
