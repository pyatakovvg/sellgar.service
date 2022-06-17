
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getComment from '../../../actions/comment/get';
import createComment from '../../../actions/comment/create';
import destroyComment from '../../../actions/comment/destroy';


export default class Saga {
  ctx = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  async execute(params) {
    const saga = await this.getSagaDefinition(this.ctx);
    try {
      return await saga.execute(params);
    }
    catch (e) {
      console.log(e)
      if (e instanceof Sagas.SagaExecutionFailed) {
        throw new NetworkError({ code: '2.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new NetworkError({ code: '2.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new Sagas.SagaBuilder();
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Create comment')
      .invoke(async (params) => {
        logger.info('create comment');

        const comment = await createComment(body);
        params.setComment(comment);
      })
      .withCompensation(async (params) => {
        logger.info('remove comment');

        const comment = params.getComment();
        await destroyComment(comment['uuid']);
      })

      .step('Get result comment')
      .invoke(async (params) => {
        logger.info('get result comment');

        const comment = params.getComment();
        const result = await getComment(comment['uuid']);
        params.setResult(result);
      })

      .step('Sent created event')
      .invoke(async (params) => {
        logger.info('send event');

        const customer = params.getResult();

        await sendEvent(process.env['EXCHANGE_COMMENT_CREATE'], JSON.stringify(customer));
      })

      .build();
  }
}
