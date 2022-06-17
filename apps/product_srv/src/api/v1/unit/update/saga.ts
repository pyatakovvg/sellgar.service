
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

    const Unit = db.models['Unit'];


    return sagaBuilder
      .step('Get unit')
      .invoke(async (params: IParams) => {
        logger.info('get unit');

        const result = await Unit.findOne({
          where: {
            uuid: body['uuid'],
          }
        });
        params.setItem(result);
      })
      .step('Update units')
      .invoke(async () => {
        logger.info('update unit');

        await Unit.update(body, {
          where: {
            uuid: body['uuid'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove unit');

        const item = params.getItem();

        await Unit.update(item, {
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Get result unit')
      .invoke(async (params: IParams) => {
        logger.info('get result unit');

        const item = params.getItem();
        const result = await Unit.findOne({
          where: {
            uuid: item['uuid'],
          },
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
