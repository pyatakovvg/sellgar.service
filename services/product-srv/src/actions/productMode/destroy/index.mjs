
import { models } from '@sellgar/db';


export default async function updateProperties(productUuid) {
  const { ProductMode } = models;

  await ProductMode.destroy({
    where: {
      productUuid,
    },
  });
}
