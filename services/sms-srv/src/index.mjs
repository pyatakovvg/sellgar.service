
import logger from '@package/logger';
// import request from '@package/request';
import { connection as connectToRabbit } from '@sellgar/rabbit';

import rabbit from './rabbit';


(async () => {
  try {
    await connectToRabbit(process.env['RABBIT_CONNECTION_HOST']);

    await rabbit();

    // const result = await request({
    //   url: 'https://' + process.env['SMS_USER'] + ':' + process.env['SMS_KEY'] + '@' + process.env['SMS_HOST'] + '/v2/sms/send',
    //   params: {
    //     number: '79154537766',
    //     sign: 'SMS Aero', // process.env['SMS_SIGN'],
    //     text: 'Тестовое сообщение пользователю',
    //   },
    // });

    // const result = await request({
    //   url: 'https://' + process.env['SMS_USER'] + ':' + process.env['SMS_KEY'] + '@' + process.env['SMS_HOST'] + '/v2/sign/list',
    // });
    //
    // console.log(result)

    logger.info('Server started on port: ' + process.env['PORT']);
  }
  catch(error) {

    logger['error'](error);
  }
})();
