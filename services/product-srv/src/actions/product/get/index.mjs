
import { models } from '@sellgar/db';


export default async function updateProperties(uuid) {
  const { Product } = models;

  const result = await Product.findOne({
    where: { uuid },
  });

  if ( ! result) {
    throw new Error(`The product is not found`);
  }

  return result.toJSON();
}
