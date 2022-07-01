
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
    const Attribute = db.models['Attribute'];


    return sagaBuilder
      .step('Get attribute')
      .invoke(async (params: IParams) => {
        logger.info('get attribute');

        const result = await Attribute.findOne({
          where: {
            uuid: body['uuid'],
          }
        });
        params.setItem(result);
      })
      .step('Update attribute')
      .invoke(async () => {
        logger.info('update attribute');

        await Attribute.update(body, {
          where: {
            uuid: body['uuid'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove attribute');

        const item = params.getItem();

        await Attribute.update(item, {
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Get result attribute')
      .invoke(async (params: IParams) => {
        logger.info('get result attribute');

        const item = params.getItem();
        const result = await Attribute.findOne({
          where: {
            uuid: item['uuid'],
          },
          attributes: ['uuid', 'name', 'description'],
          include: [
            {
              model: Unit,
              as: 'unit',
              attributes: ['uuid', 'name', 'description'],
            }
          ]
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
