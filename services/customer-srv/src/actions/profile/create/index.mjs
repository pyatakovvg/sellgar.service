
import { models } from '@sellgar/db';


export default async function(data) {
  const { Profile } = models;

  const result = await Profile.create(data);

  if ( ! result) {
    throw new Error(`The profile is not created`);
  }

  return result.toJSON();
}
