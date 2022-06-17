
import { models } from '@sellgar/db';


export default async function(uuid, data) {
  const { Profile } = models;

  const object = {};

  if ('name' in data) {
    object['name'] = data['name'];
  }

  if ('email' in data) {
    object['email'] = data['email'];
  }

  if ('phone' in data) {
    object['phone'] = data['phone'];
  }

  if ('birthday' in data) {
    object['birthday'] = data['birthday'];
  }

  await Profile.update(object, {
    where: {
      uuid,
    },
  });
}
