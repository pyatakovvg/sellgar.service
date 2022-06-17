
import { models } from '@sellgar/db';


export default async function(data = {}) {
  const { ProductMode, Product, ProductGallery, Group, Category, Brand, Currency, Attribute, Unit } = models;
  const where = {};
  const offset = {};
  const options = {};


  if ('uuid' in data) {
    where['uuid'] = data['uuid'];
  }

  if ('limit' in data) {
    options['limit'] = Number(data['limit']);
  }

  if (('skip' in data) && ('take' in data)) {
    offset['offset'] = Number(data['skip']);
    offset['limit'] = Number(data['take']);
  }

  const result = await Product.findAndCountAll({
    ...options,
    ...offset,
    distinct: true,
    where: { ...where },
    order: [
      ['modes', 'order', 'asc'],
      ['gallery', 'order', 'asc'],
    ],
    attributes: ['uuid', 'seoTitle', 'seoDescription', 'seoKeywords', 'externalId', 'title', 'originalName', 'description', 'isUse', 'isAvailable', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Group,
        required: false,
        attributes: ['uuid', 'code', 'name', 'description'],
        as: 'group',
      },
      {
        model: Category,
        required: false,
        attributes: ['uuid', 'code', 'name', 'description'],
        as: 'category',
      },
      {
        model: Brand,
        required: false,
        attributes: ['uuid', 'code', 'name', 'description'],
        as: 'brand',
      },
      {
        model: ProductGallery,
        required: false,
        attributes: [['imageUuid', 'uuid']],
        as: 'gallery',
      },
      {
        model: ProductMode,
        required: true,
        as: 'modes',
        attributes: ['uuid', 'vendor', 'value', 'price', 'isUse', 'isTarget'],
        include: [
          {
            model: Currency,
            attributes: ['code', 'displayName'],
            as: 'currency',
          }
        ]
      },
      {
        model: Attribute,
        through: 'ProductAttribute',
        as: 'attributes',
        include: [
          {
            model: Unit,
            as: 'unit',
          }
        ]
      },
    ],
  });

  return {
    data: result['rows'].map((item) => item.toJSON()),
    meta: {
      totalRows: result['count'],
    },
  };
}
