
import { models } from '@sellgar/db';


export default async function updateProperties(productUuid, gallery) {
  const { ProductGallery } = models;

  const newGallery = gallery.map((imageUuid, index) => ({
    imageUuid,
    productUuid,
    order: index,
  }));

  await ProductGallery.bulkCreate(newGallery);
}
