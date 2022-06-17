
import { models } from '@sellgar/db';


export default async function(uuid, data) {
  const { Role } = models;

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

  await Role.update(object, {
    where: {
      uuid,
    },
  });
};
