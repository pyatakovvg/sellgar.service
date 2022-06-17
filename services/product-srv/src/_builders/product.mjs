
import modeBuilder from './mode.mjs';
import groupBuilder from './group.mjs';
import brandBuilder from './brand.mjs';
import galleryBuilder from './gallery.mjs';
import categoryBuilder from './category.mjs';
import attributeBuilder from './attribute.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    seoTitle: data['seoTitle'],
    seoDescription: data['seoDescription'],
    seoKeywords: data['seoKeywords'],
    externalId: data['externalId'],
    title: data['title'],
    originalName: data['originalName'],
    description: data['description'],
    isUse: data['isUse'],
    isAvailable: data['isAvailable'],
    group: data['group'] ? groupBuilder(data['group']) : null,
    category: data['category'] ? categoryBuilder(data['category']) : null,
    brand: data['brand'] ? brandBuilder(data['brand']) : null,
    gallery: data['gallery'] ? galleryBuilder(data['gallery']) : [],
    modes: data['modes'].map((item) => modeBuilder(item)),
    attributes: data['attributes'].map((item) => attributeBuilder(item)),
    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}