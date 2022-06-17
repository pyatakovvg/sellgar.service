
import { models } from '@sellgar/db';


export default async function(data) {
  const { Brand } = models;

  const result = await Brand.bulkCreate(data.map((brand, index) => {
    const object = {};

    if ('uuid' in brand) {
      object['uuid'] = brand['uuid']
    }

    return {
      ...object,
      code: brand['code'],
      name: brand['name'],
      description: brand['description'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The brands are not created`);
  }

  return result.map((item) => item.toJSON());
}
