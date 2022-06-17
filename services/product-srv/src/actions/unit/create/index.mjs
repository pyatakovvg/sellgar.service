
import { models } from '@sellgar/db';


export default async function(data) {
  const { Unit } = models;

  const result = await Unit.bulkCreate(data.map((unit, index) => {
    const object = {};

    if ('uuid' in unit) {
      object['uuid'] = unit['uuid']
    }

    if ('parentUuid' in unit) {
      object['parentUuid'] = unit['parentUuid']
    }

    return {
      ...object,
      name: unit['name'],
      description: unit['description'],
      order: index,
    }
  }), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The units are not created`);
  }

  return result.map((item) => item.toJSON());
}
