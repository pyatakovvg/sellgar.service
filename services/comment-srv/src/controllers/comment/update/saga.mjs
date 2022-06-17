
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getComment from '../../../actions/comment/get';
import updateComment from '../../../actions/comment/update';


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
    const { uuid } = this.ctx['params'];
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Get comment')
      .invoke(async (params) => {
        logger.info('get comment');

        const comment = await getComment(uuid);
        params.setComment(comment);
      })

      .step('Update comment')
      .invoke(async () => {
        logger.info('update comment');

        await updateComment(uuid, body);
      })
      .withCompensation(async (params) => {
        logger.info('remove comment');

        const comment = params.getComment();
        await updateComment(uuid, comment);
      })

      .step('Get result comment')
      .invoke(async (params) => {
        logger.info('get result comment');

        const result = await getComment(uuid);
        params.setResult(result);
      })

      .step('Sent updated event')
      .invoke(async (params) => {
        logger.info('send event');

        const customer = params.getResult();

        await sendEvent(process.env['EXCHANGE_COMMENT_UPDATE'], JSON.stringify(customer));
      })

      .build();
  }
}
