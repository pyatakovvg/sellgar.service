
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

    const Group = db.models['Group'];


    return sagaBuilder
      .step('Create group')
      .invoke(async (params: IParams) => {
        logger.info('create group');

        const result = await Group.create(body);
        params.setItem(result);
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove group');

        const item = params.getItem();
        await Group.destroy({
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Get result group')
      .invoke(async (params: IParams) => {
        logger.info('get result group');

        const item = params.getItem();

        const result = await Group.findOne({
          where: {
            uuid: item['uuid'],
          },
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
