
import { UUID } from '@helper/utils';
import request from '@package/request';

import crypto from 'crypto';


export default async function init(rabbit, app) {
  await rabbit.consumer(process.env['PIKASSA_SRV_PAYMENT_CREATE_QUEUE'], { reply: true }, async (data, cb) => {
    // const db = app.plugins['db'];

    try {
      const externalId = UUID();

      const body = {
        externalId,
        amount: 105.05,
        currency: 'RUB',
        description: 'Оплата заказа'
      };

      const bodyString = JSON.stringify(body);
      const bodySalt = bodyString + process.env['PIKASSA_SECRET_KEY'];
      const bodyEncoding = Buffer.from(bodySalt).toString('utf-8');

      const secretBody = crypto.createHash('md5').update(bodyEncoding).digest("hex");
      const sign = Buffer.from(secretBody, 'utf-8').toString('base64');

      const result = await request({
        url: process.env['PIKASSA_URL_API'] + '/invoices',
        method: 'post',
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-api-key': process.env['PIKASSA_API_KEY'],
          'x-sign': sign,
        },
        data: bodyString,
      });

      console.log(result);

      cb(true, result['data']);
    }
    catch(error) {

      cb(true, error['data']);
    }
  });
}
