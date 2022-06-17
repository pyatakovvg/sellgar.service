
import { models } from '@sellgar/db';


export default async function(uuid, data) {
  const { Customer } = models;

  const object = {};

  if ('uuid' in data) {
    object['uuid'] = data['uuid'];
  }

  if ('createdAt' in data) {
    object['createdAt'] = data['createdAt'];
  }

  if ('updatedAt' in data) {
    object['updatedAt'] = data['updatedAt'];
  }
  else {
    object['updatedAt'] = new Date();
  }

  await Customer.update(object, {
    where: {
      uuid,
    },
  });
}
