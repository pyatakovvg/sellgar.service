
import brandBuilder from './brand';
import attributeGroupBuilder from './attributeGroup';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['externalId'],
    barcode: data['barcode'],
    vendor: data['vendor'],

    title: data['title'],
    description: data['description'] || '',

    group: data['group'],
    category: data['category'],
    brand: data['brand']
      ? brandBuilder(data['brand'])
      : null,

    price: Number(data['price']),
    purchasePrice: Number(data['purchasePrice']),
    currency: data['currency'],

    images: data['images'].map((image: any) => ({
      uuid: image?.['image']?.['uuid'],
      name: image?.['image']?.['name'],
    })),

    attributes: data['attributes'].map(attributeGroupBuilder),

    isUse: data['isUse'],
    isAvailable: data['isAvailable'],

    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}