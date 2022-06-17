
import { models } from '@sellgar/db';


export default async function(data) {
  const { Group } = models;

  const result = await Group.bulkCreate(data.map((group, index) => {
    const object = {};

    if ('uuid' in group) {
      object['uuid'] = group['uuid']
    }

    return {
      ...group,
      code: group['code'],
      name: group['name'],
      description: group['description'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The groups are not created`);
  }

  return result.map((item) => item.toJSON());
}
