
import { Route, Result, Controller } from '@library/app';

import productBuilder from './builders/product';


function getAttrsFilter(query: any) {
  const attrsKey = Object.keys(query).filter((key) => /^attr/.test(key));
  const attrsCode = [];
  for (let index in attrsKey) {
    const key = attrsKey[index];
    const attrCode = key.match(/^attr\[(.*)\]/)[1];
    attrsCode[attrCode] = query[key];
  }
  return attrsCode;
}


@Route('get', '/api/v1/products')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const whereAttr = {};

    const offset = {};
    const options = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Unit = db.models['Unit'];
    const Group = db.models['Group'];
    const Brand = db.models['Brand'];
    const Product = db.models['Product'];
    const Category = db.models['Category'];
    const Currency = db.models['Currency'];
    const Attribute = db.models['Attribute'];
    const ProductMode = db.models['ProductMode'];
    const ProductGallery = db.models['ProductGallery'];
    const AttributeValue = db.models['AttributeValue'];

    const attrQuery = getAttrsFilter(data);


    if ('uuid' in data) {
      where['uuid'] = data['uuid'];
    }

    if ('externalId' in data) {
      where['externalId'] = data['externalId'];
    }

    if ('isUse' in data) {
      where['isUse'] = data['isUse'] === 'true';
    }

    if ('groupCode' in data) {
      where['groupCode'] = data['groupCode'];
    }

    if ('categoryCode' in data) {
      where['categoryCode'] = data['categoryCode'];
    }

    if ('brandCode' in data) {
      where['brandCode'] = data['brandCode'];
    }

    if ( !! Object.keys(attrQuery).length) {
      const bulk = [];
      const keys = Object.keys(attrQuery);

      for (let index in keys) {
        const key = keys[index];

        const result = await Attribute.findOne({
          raw: true,
          where: {
            code: key,
          },
          attributes: ['uuid'],
        });

        bulk.push({
          attributeUuid: result['uuid'],
          value: attrQuery[key],
        });
      }

      whereAttr[db.Op.or] = bulk;
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
        ['createdAt', 'asc'],
        ['modes', 'order', 'asc'],
        ['gallery', 'order', 'asc'],
      ],
      attributes: ['uuid', 'seoTitle', 'seoDescription', 'seoKeywords', 'externalId', 'title', 'originalName', 'description', 'isUse', 'isAvailable', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Group,
          required: false,
          attributes: ['code', 'name', 'description'],
          as: 'group',
        },
        {
          model: Category,
          required: false,
          attributes: ['code', 'name', 'description'],
          as: 'category',
        },
        {
          model: Brand,
          required: false,
          attributes: ['code', 'name', 'description'],
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
          model: AttributeValue,
          through: 'ProductAttribute',
          attributes: ['value'],
          required: false,
          where: {
            ...whereAttr,
          },
          as: 'attributes',
          include: [
            {
              model: Attribute,
              required: false,
              as: 'attribute',
              include: [
                {
                  model: Unit,
                  as: 'unit',
                }
              ],
            }
          ]
        },
      ],
    });

    return new Result()
      .data(result['rows'].map((item) => productBuilder(item.toJSON())))
      .meta({
        totalRows: result['count'],
      })
      .build();
  }
}

export default GetProductsController;
