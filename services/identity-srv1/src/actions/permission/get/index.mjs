
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Permission } = models;

  const result = await Permission.findByPk(uuid, {
    attributes: ['uuid', 'code', 'displayName'],
  });

  if ( ! result) {
    throw new Error(`The permission '${uuid}' is not found`);
  }

  return result.toJSON();
};
