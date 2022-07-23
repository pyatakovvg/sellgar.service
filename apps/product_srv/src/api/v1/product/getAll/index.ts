
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const where = {};

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
      const group = await Group.findOne({ row: true, where: { code: data['groupCode'] }});
      where['groupUuid'] = group['uuid'];
    }

    if ('categoryCode' in data) {
      const category = await Category.findOne({ row: true, where: { code: data['categoryCode'] }});
      where['categoryUuid'] = category['uuid'];
    }

    if ('brandCode' in data) {
      const category = await Brand.findAll({ row: true, where: { code: data['brandCode'] }});
      where['brandUuid'] = category.map((brand) => brand['uuid']);
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
        ['attributes', 'order', 'asc'],
      ],
      attributes: ['uuid', 'seoTitle', 'seoDescription', 'seoKeywords', 'externalId', 'title', 'originalName', 'description', 'isUse', 'isAvailable', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Group,
          attributes: ['uuid', 'code', 'name', 'description'],
          as: 'group',
        },
        {
          model: Category,
          attributes: ['uuid', 'code', 'name', 'description'],
          as: 'category',
        },
        {
          model: Brand,
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

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        totalRows: result['count'],
      })
      .build();
  }
}

export default GetProductsController;
