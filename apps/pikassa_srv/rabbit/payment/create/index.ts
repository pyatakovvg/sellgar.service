
// import { UUID } from '@helper/utils';
// import request from '@package/request';
//
// import crypto from 'crypto';


export default async function init() {
  // await rabbit.consumer(process.env['PIKASSA_SRV_PAYMENT_CREATE_QUEUE'], { reply: true }, async (data, cb) => {
  //   // const db = app.plugins['db'];
  //
  //   try {
  //     const externalId = UUID();
  //
  //     const body = {
  //       externalId,
  //       amount: 105.05,
  //       currency: 'RUB',
  //       description: 'Оплата заказа'
  //     };
  //
  //     const bodyWithSalt = JSON.stringify(body) + process.env['PIKASSA_SECRET_KEY'];
  //     const hash = crypto.createHash('md5').update(bodyWithSalt).digest();
  //     const sign = hash.toString('base64');
  //
  //     const result = await request({
  //       url: process.env['PIKASSA_URL_API'] + '/invoices',
  //       method: 'post',
  //       headers: {
  //         'X-Sign': sign,
  //         'X-Api-Key': process.env['PIKASSA_API_KEY'],
  //         'Content-Type': 'application/json; charset=utf-8',
  //       },
  //       data: body,
  //     });
  //
  //     cb(true, { success: true, data: result['data'] });
  //   }
  //   catch(error) {
  //
  //     cb(true, { success: false, error: error['data'] });
  //   }
  // });
}
