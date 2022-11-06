
import productBuilder from './product';
import attributeGroupBuilder from './attributeGroup';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['externalId'],
    name: data['name'],
    description: data['description'],

    group: data['group'],
    category: data['category'],

    images: data['images'].map((image: any) => ({
      uuid: image?.['image']?.['uuid'],
      name: image?.['image']?.['name'],
    })),

    product: data['product'] ? productBuilder(data['product']) : null,
    attributes: data['attributes'].map(attributeGroupBuilder),

    allCommentCount: data['allCommentCount'],

    isUse: data['isUse'],

    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}