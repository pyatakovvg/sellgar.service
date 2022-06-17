
import { models } from '@sellgar/db';


export default async function(data) {
  const { Theme } = models;

  const result = await Theme.bulkCreate(data.map((theme, index) => {
    const object = {};

    if ('uuid' in theme) {
      object['uuid'] = theme['uuid']
    }

    return {
      ...object,
      name: theme['name'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( ! result.length) {
    throw new Error(`The themes are not created`);
  }

  return result.map((item) => item.toJSON());
}
