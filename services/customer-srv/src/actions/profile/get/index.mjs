
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Profile } = models;

  const result = await Profile.findByPk(uuid);

  if ( ! result) {
    throw new Error(`The profile is not found`);
  }

  return result.toJSON();
}
