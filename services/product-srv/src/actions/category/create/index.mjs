
import { models } from '@sellgar/db';


export default async function(data) {
  const { Category } = models;

  const result = await Category.bulkCreate(data.map((category, index) => {
    const object = {};

    if ('uuid' in category) {
      object['uuid'] = category['uuid']
    }

    return {
      ...object,
      code: category['code'],
      name: category['name'],
      description: category['description'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The categories are not created`);
  }

  return result.map((item) => item.toJSON());
}
