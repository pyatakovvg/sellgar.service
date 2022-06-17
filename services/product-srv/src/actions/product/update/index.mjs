
import { models } from '@sellgar/db';


export default async function createProduct(uuid, data = {}) {
  const { Product } = models;
  const object = {};

  if ('seoTitle' in data) {
    object['seoTitle'] = data['seoTitle'];
  }

  if ('seoDescription' in data) {
    object['seoDescription'] = data['seoDescription'];
  }

  if ('seoKeywords' in data) {
    object['seoKeywords'] = data['seoKeywords'];
  }

  if ('groupUuid' in data) {
    object['groupUuid'] = data['groupUuid'];
  }

  if ('categoryUuid' in data) {
    object['categoryUuid'] = data['categoryUuid'];
  }

  if ('brandUuid' in data) {
    object['brandUuid'] = data['brandUuid'];
  }

  if ('externalId' in data) {
    object['externalId'] = data['externalId'];
  }

  if ('title' in data) {
    object['title'] = data['title'];
  }

  if ('originalName' in data) {
    object['originalName'] = data['originalName'];
  }

  if ('description' in data) {
    object['description'] = data['description'];
  }

  if ('isUse' in data) {
    object['isUse'] = data['isUse'];
  }

  if ('isAvailable' in data) {
    object['isAvailable'] = data['isAvailable'];
  }

  if ('createdAt' in data) {
    object['createdAt'] = data['createdAt'];
  }

  if ('updatedAt' in data) {
    object['updatedAt'] = data['updatedAt'];
  }

  await Product.update({
    ...object,
  }, {
    where: {
      uuid,
    },
  });
}
