
import { models } from '@sellgar/db';


export default async function(data) {
  const { Attribute } = models;

  const result = await Attribute.bulkCreate(data.map((attribute, index) => {
    const object = {};

    if ('uuid' in attribute) {
      object['uuid'] = attribute['uuid']
    }

    if ('unitUuid' in attribute) {
      object['unitUuid'] = attribute['unitUuid']
    }

    if ('categoryUuid' in attribute) {
      object['categoryUuid'] = attribute['categoryUuid']
    }

    return {
      ...object,
      name: attribute['name'],
      description: attribute['description'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The attributes are not created`);
  }

  return result.map((item) => item.toJSON());
}
