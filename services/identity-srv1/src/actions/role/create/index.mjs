
import { models } from '@sellgar/db';


export default async function(data) {
  const { Role } = models;

  const result = await Role.create(data);

  if ( ! result) {
    throw new Error(`The role is not created`);
  }

  return result.toJSON();
};
