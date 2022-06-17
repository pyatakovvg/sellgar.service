
import { models } from '@sellgar/db';


export default async function updateProperties(productUuid) {
  const { ProductGallery } = models;

  await ProductGallery.destroy({
    where: {
      productUuid,
    }});
}
