
import { consumer } from '@sellgar/rabbit';

import { orderCreated, orderUpdated } from '../../actions/order';


export default async function() {
  await consumer(process.env['QUEUE_MAIL_ORDER_CREATE'], async (data, cb) => {
    const result = JSON.parse(data);
    await orderCreated(result);
    cb(true);
  });

  await consumer(process.env['QUEUE_MAIL_ORDER_UPDATE'], async (data, cb) => {
    const result = JSON.parse(data);
    await orderUpdated(result);
    cb(true);
  });
}
