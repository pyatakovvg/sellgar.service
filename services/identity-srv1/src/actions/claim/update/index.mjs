
import { models } from '@sellgar/db';


export default async function(data) {
  const { Claim } = models;

  const object = {};

  if (data['type']) {
    object['type'] = data['type'];
  }

  if (data['description']) {
    object['description'] = data['description'];
  }

  if ( ! Object.keys(object).length) {
    return void 0;
  }

  await Claim.update(object, {
    where: {
      uuid: data['uuid'],
    },
  });
};
