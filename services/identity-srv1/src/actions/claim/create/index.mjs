
import { models } from '@sellgar/db';


export default async function(data) {
  const { Claim } = models;

  const result = await Claim.create(data);

  if ( ! result) {
    throw new Error(`The claim in not created`);
  }

  return result.toJSON();
};
