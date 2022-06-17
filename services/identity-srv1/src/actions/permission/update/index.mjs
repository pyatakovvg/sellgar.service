
import { models } from '@sellgar/db';


export default async function(data) {
  const { Permission } = models;

  const object = {};

  if (data['code']) {
    object['code'] = data['code'];
  }

  if (data['displayName']) {
    object['displayName'] = data['displayName'];
  }

  if ( ! Object.keys(object).length) {
    return void 0;
  }

  await Permission.update(object, {
    where: {
      uuid: data['uuid'],
    },
  });
};
