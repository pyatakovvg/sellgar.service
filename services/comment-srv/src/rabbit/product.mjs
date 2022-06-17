
import { bindToExchange } from "@sellgar/rabbit";

import { create, update, destroy } from '../actions/product';


export default async function() {
  const salt = Date.now().toString(32);

  await bindToExchange(process.env['QUEUE_PRODUCT_CREATE'] + '_' + salt, process.env['EXCHANGE_PRODUCT_CREATE'], async (data, cb) => {
    try {
      await create(JSON.parse(data));
      cb(true);
    }
    catch(error) {
      cb(false);
    }
  });

  await bindToExchange(process.env['QUEUE_PRODUCT_UPDATE'] + '_' + salt, process.env['EXCHANGE_PRODUCT_UPDATE'], async (data, cb) => {
    try {
      await update(JSON.parse(data));
      cb(true);
    }
    catch(error) {
      cb(false);
    }
  });

  await bindToExchange(process.env['QUEUE_PRODUCT_DELETE'] + '_' + salt, process.env['EXCHANGE_PRODUCT_DELETE'], async (data, cb) => {
    try {
      await destroy(JSON.parse(data));
      cb(true);
    }
    catch(error) {
      cb(false);
    }
  });
};
