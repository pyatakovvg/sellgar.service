
import groupBuilder from './group';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['externalId'],
    title: data['title'],
    description: data['description'] || '',

    group: data['group'],
    category: data['category'],
    brand: data['brand'],

    price: Number(data['price']),
    currency: data['currency'],

    images: data['images'].map((image: any) => ({
      uuid: image?.['image']?.['uuid'],
      name: image?.['image']?.['name'],
    })),

    attributes: data['attributes'].map(groupBuilder),

    isUse: data['isUse'],
    isAvailable: data['isAvailable'],

    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}