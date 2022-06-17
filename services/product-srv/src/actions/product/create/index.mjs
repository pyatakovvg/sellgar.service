
import { models } from '@sellgar/db';


export default async function createProduct(data = {}) {
  const { Product } = models;
  const object = {};

  if ('uuid' in data) {
    object['uuid'] = data['uuid'];
  }

  if ('createdAt' in data) {
    object['createdAt'] = data['createdAt'];
  }

  if ('updatedAt' in data) {
    object['updatedAt'] = data['updatedAt'];
  }

  const result = await Product.create({
    ...object,
    seoTitle: data['seoTitle'],
    seoDescription: data['seoDescription'],
    seoKeywords: data['seoKeywords'],
    groupUuid: data['groupUuid'],
    categoryUuid: data['categoryUuid'],
    brandUuid: data['brandUuid'],
    externalId: data['externalId'],
    title: data['title'],
    originalName: data['originalName'],
    description: data['description'],
    isUse: data['isUse'],
    isAvailable: data['isAvailable'],
  });

  if ( ! result) {
    throw new Error(`The product is not created`);
  }

  return result.toJSON();
}
