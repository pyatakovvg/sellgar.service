
import { Controller } from '@library/app';


class Product {
  private parent: Controller;

  constructor(parent: Controller) {
    this.parent = parent;
  }

  async update(uuid: string, data: any) {
    const db = this.parent.plugin.get('db');
    const { Product } = db.models;

    await Product.update(data, {
      where: {
        uuid,
        updatedAt: data['updatedAt'],
      },
    });
  }

  async getOnlyOneByUuid(uuid: string) {
    const db = this.parent.plugin.get('db');
    const { Product } = db.models;

    const result = await Product.findOne({
      where: { uuid },
      attributes: ['uuid', 'seoTitle', 'seoDescription', 'seoKeywords', 'externalId', 'title', 'originalName', 'description', 'isUse', 'isAvailable', 'createdAt', 'updatedAt'],
    });

    return result.toJSON();
  }

  async getByUuid(uuid: string) {
    const db = this.parent.plugin.get('db');
    const { ProductMode, Product, Brand, Attribute, Unit, ProductGallery, Currency, Group, Category } = db.models;

    const result = await Product.findOne({
      where: { uuid },
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
          required: false,
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

    return result.toJSON();
  }
}

export default Product;

// export default async function updateProperties(uuid) {
//   const { ProductMode, Product, ProductGallery, Currency, Group, Category } = models;
//
//   const result = await Product.findOne({
//     where: { uuid },
//     order: [
//       ['modes', 'order', 'asc'],
//       ['gallery', 'order', 'asc'],
//     ],
//     attributes: ['uuid', 'externalId', 'title', 'originalName', 'description', 'isUse', 'isAvailable', 'updatedAt'],
//     include: [
//       {
//         model: Group,
//         required: false,
//         attributes: ['uuid', 'value'],
//         as: 'group',
//       },
//       {
//         model: Category,
//         required: false,
//         attributes: ['uuid', 'value'],
//         as: 'category',
//       },
//       {
//         model: ProductGallery,
//         required: false,
//         attributes: [['imageUuid', 'uuid']],
//         as: 'gallery',
//       },
//       {
//         model: ProductMode,
//         required: false,
//         as: 'modes',
//         attributes: ['uuid', 'vendor', 'value', 'price', 'isUse', 'isTarget'],
//         include: [
//           {
//             model: Currency,
//             attributes: ['code', 'displayName'],
//             as: 'currency',
//           }
//         ]
//       },
//     ],
//   });
//
//   return result.toJSON();
// }
