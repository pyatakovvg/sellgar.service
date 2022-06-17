
import { consumer } from '@sellgar/rabbit';

import { userCreated } from '../../actions/user';


export default async function() {
  await consumer(process.env['QUEUE_MAIL_USER_CREATE'], async (data, cb) => {
    const result = JSON.parse(data);
    await userCreated(result);
    cb(true);
  });
}
