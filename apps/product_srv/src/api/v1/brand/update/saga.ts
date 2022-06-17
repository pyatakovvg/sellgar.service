
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
        throw new InternalServerError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition(): Promise<any> {
    const body = this.parent.body;
    const db = this.parent.plugin.get('db');
    const sagaBuilder = new Sagas.SagaBuilder();

    const Brand = db.models['Brand'];


    return sagaBuilder
      .step('Get brand')
      .invoke(async (params: IParams) => {
        logger.info('get brand');

        const result = await Brand.findOne({
          where: {
            uuid: body['uuid'],
          }
        });
        params.setItem(result);
      })
      .step('Update brand')
      .invoke(async (params: IParams) => {
        logger.info('update brand');

        await Brand.update(body, {
          where: {
            uuid: body['uuid'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove brand');

        const item = params.getItem();

        await Brand.update(item, {
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Get result brand')
      .invoke(async (params: IParams) => {
        logger.info('get result brand');

        const item = params.getItem();
        const result = await Brand.findOne({
          where: {
            uuid: item['uuid'],
          },
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
