
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getComments from '../../../actions/comment/getAll';
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

    return sagaBuilder
      .step('Get comments')
      .invoke(async (params) => {
        logger.info('get comment');

        const comments = await getComments({ uuid });
        params.setComment(comments);
      })

      .step('Destroy comment')
      .invoke(async () => {
        logger.info('destroy comment');

        await destroyComment(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('rollback comment');

        const comments = params.getComment();
        comments.map(async (comment) => {
          await createComment(comment);
        });
      })

      .step('Sent destroyed event')
      .invoke(async (params) => {
        logger.info('send event');

        const customers = params.getComment();
        await sendEvent(process.env['EXCHANGE_COMMENT_DELETE'], JSON.stringify(customers));
      })

      .build();
  }
}
