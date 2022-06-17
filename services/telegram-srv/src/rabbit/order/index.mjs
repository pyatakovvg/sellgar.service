
import logger from '@package/logger';
import { consumer } from '@sellgar/rabbit';

export default async function() {

  await consumer(process.env['QUEUE_ORDER_CREATED'],async(message, cb) => {
    try {
      console.log(JSON.parse(message));
      cb(true);
    }
    catch(error) {
      logger['error'](error['message']);
      cb(false);
    }
  });
}