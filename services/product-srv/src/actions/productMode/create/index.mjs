
import { models } from '@sellgar/db';


export default async function(productUuid, modes) {
  const { ProductMode } = models;

    await ProductMode.bulkCreate(modes.map((mode, index) => ({
      productUuid,
      value: mode['value'],
      vendor: mode['vendor'],
      price: mode['price'],
      currencyCode: mode['currencyCode'],
      isUse: mode['isUse'],
      isTarget: mode['isTarget'],
      order: index,
    })));
}
