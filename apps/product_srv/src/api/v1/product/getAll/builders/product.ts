
import modeBuilder from './mode';
import attributeBuilder from './attribute';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    seoTitle: data['seoTitle'],
    seoDescription: data['seoDescription'],
    seoKeywords: data['seoKeywords'],
    externalId: data['externalId'],
    title: data['title'],
    originalName: data['originalName'] || null,
    description: data['description'] || '',
    isUse: data['isUse'],
    isAvailable: data['isAvailable'],
    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
    commentsCount: Number(data['commentsCount']),
    group: data['group'],
    category: data['category'],
    brand: data['brand'],
    gallery: data['gallery'],
    modes: data['modes'] ? data['modes'].map(modeBuilder) : [],
    attributes: data['attributes'] ? data['attributes'].map(attributeBuilder) : [],
  };
}