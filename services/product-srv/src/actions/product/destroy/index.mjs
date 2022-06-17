
import { models } from '@sellgar/db';


export default async function updateProperties(uuid) {
  const { Product } = models;

  await Product.destroy({
    where: { uuid },
  });
}
