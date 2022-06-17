
import logger from "@package/logger";
import { bindToExchange } from "@sellgar/rabbit";

import { customerCreate, customerUpdate } from '../actions/customer';


export default async function() {
  const salt = Date.now().toString(32);

  await bindToExchange(process.env['QUEUE_CUSTOMER_CREATE'] + '_' + salt, process.env['EXCHANGE_CUSTOMER_CREATE'], async (data, cb) => {
    try {
      const result = JSON.parse(data);
      await customerCreate(result);

      cb(true);
    }
    catch(error) {

      logger.error(error['message']);

      cb(false);
    }
  });

  await bindToExchange(process.env['QUEUE_CUSTOMER_UPDATE'] + '_' + salt, process.env['EXCHANGE_CUSTOMER_UPDATE'], async (data, cb) => {
    try {
      const result = JSON.parse(data);
      await customerUpdate(result);

      cb(true);
    }
    catch(error) {

      logger.error(error['message']);

      cb(false);
    }
  });
}
