
import logger from '@package/logger';
import { connection as connectToRabbit } from '@sellgar/rabbit';

import rabbit from './rabbit';


(async () => {
  try {
    await connectToRabbit(process.env['RABBIT_CONNECTION_HOST']);

    await rabbit();

    // process.on('exit', () => console.log('Приложение закрыто'));
    // process.on('disconnect', () => console.log('Приложение disconnect'));
    // const apiId = 8975562;
    // const apiHash = '2d1cd17b59689979577abc4bc5b000b5';
    // const stringSession = new StringSession(''); // fill this later with the value from session.save()
    //
    // console.log('Loading interactive example...')
    // const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
    // await client.start({
    //   phoneNumber: '+79154537766',
    //   password: async () => await input.text('password?'),
    //   phoneCode: async () => await input.text('Code ?'),
    //   // botAuthToken: process.env['BOT_TOKEN'],
    //   onError: (err) => console.log(err),
    // });
    // console.log('You should now be connected.')
    // console.log(client.session.save()) // Save this string to avoid logging in again
    // await client.sendMessage('me', { message: 'Hello!' });

  }
  catch(error) {

    logger['error'](error);
  }
})();
