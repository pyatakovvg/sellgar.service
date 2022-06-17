
import { models } from '@sellgar/db';


export default async function(productUuid, attributes) {
  const { ProductAttribute } = models;

  const newAttributes = attributes.map((attr) => ({
    productUuid,
    value: attr['value'],
    attributeUuid: attr['uuid'],
  }));

  await ProductAttribute.bulkCreate(newAttributes);
}
