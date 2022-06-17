
import { models } from '@sellgar/db';


export default async function(data) {
  const { Permission } = models;

  const result = await Permission.create(data);

  if ( ! result) {
    throw new Error(`The permission is not created`);
  }

  return result.toJSON();
};
