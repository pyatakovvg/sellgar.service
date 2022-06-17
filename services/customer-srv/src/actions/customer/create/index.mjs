
import { models } from '@sellgar/db';


export default async function(data) {
  const { Customer } = models;

  const result = await Customer.create(data);

  if ( ! result) {
    throw new Error(`The customer is not created`);
  }

  return result.toJSON();
}
