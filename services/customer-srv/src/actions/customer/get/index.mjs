
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Customer, Profile } = models;

  const result = await Customer.findByPk(uuid, {
    attributes: ['uuid', 'profileUuid', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Profile,
        as: 'profile',
      }
    ]
  });

  if ( ! result) {
    throw new Error(`The customer is not found`);
  }

  return result.toJSON();
}
