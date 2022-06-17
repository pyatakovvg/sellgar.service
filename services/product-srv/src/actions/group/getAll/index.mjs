
import {models, sequelize} from '@sellgar/db';


export default async(includeAt) => {
  const { Group, Category, Brand, Product, ProductGallery, ProductMode, Currency, Attribute, Unit } = models;

  const group = [];
  const attributes = [];
  const includedModels = [];

  if (includeAt.includes('category')) {
    const includeCategoryModels = [];

    if (includeAt.includes('brand')) {
      includeCategoryModels.push({
        model: Brand,
        throw: {},
        as: 'brands',
      });
    }

    includedModels.push({
      model: Category,
      throw: {},
      as: 'categories',
      include: includeCategoryModels,
    });
  }
  else if (includeAt.includes('products-count')) {

    group.push('Group.uuid');
    group.push('products.groupUuid');
    attributes.push([sequelize.fn('COUNT', sequelize.col('products.groupUuid')), 'productsCount']);

    includedModels.push({
      model: Product,
      attributes: [],
      as: 'products',
    });
  }
  else if (includeAt.includes('products')) {

    includedModels.push({
      model: Product,
      attributes: ['externalId'],
      as: 'products',
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
    })
  }

  const result = await Group.findAll({
    group: [
      ...group,
    ],
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'code', 'name', 'description', ...attributes],
    include: includedModels,
  });

  return result.map((item) => item.toJSON());
}
