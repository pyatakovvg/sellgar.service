
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Claim } = models;

  const result = await Claim.findByPk(uuid, {
    attributes: ['uuid', 'type', 'description'],
  });

  if ( ! result) {
    throw new Error(`The claim '${uuid}' is not found`);
  }

  return result.toJSON();
};
