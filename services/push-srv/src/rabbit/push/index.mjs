
import logger from '@package/logger';
import { consumer } from '@sellgar/rabbit';

import { pushSend } from '../../actions/push';


export default async function() {

  await consumer(process.env['QUEUE_PUSH_SEND'], async (data, cb) => {
    try {
      const result = JSON.parse(data);

      await pushSend(result);
      cb(true);
    }
    catch(error) {
      logger.error(error);
      cb(true);
    }
  });
}
