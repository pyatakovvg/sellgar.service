
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

    const Brand = db.models['Brand'];


    return sagaBuilder
      .step('Create brand')
      .invoke(async (params: IParams) => {
        logger.info('create brand');

        console.log(body)
        const result = await Brand.create(body);
        params.setItem(result);
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove brand');

        const item = params.getItem();

        if ( ! item) {
          return void 0;
        }

        await Brand.destroy({
          where: {
            code: item['code'],
          }
        });
      })

      .step('Get result brand')
      .invoke(async (params: IParams) => {
        logger.info('get result brand');

        const item = params.getItem();

        const result = await Brand.findOne({
          where: {
            code: item['code'],
          },
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
