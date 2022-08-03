
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/attributes')
class GetAttributesController extends Controller {
  async send(): Promise<any> {
    const where = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Unit = db.models['Unit'];
    const Group = db.models['Group'];
    const Brand = db.models['Brand'];
    const Product = db.models['Product'];
    const Category = db.models['Category'];
    const Attribute = db.models['Attribute'];
    const AttributeValue = db.models['AttributeValue'];


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

    // const result = await Product.findAll({
    //   distinct: true,
    //   order: [
    //     ['attributes', 'value', 'asc'],
    //     // ['attributes', 'attribute', 'name', 'asc'],
    //   ],
    //   group: [
    //     'Product.uuid',
    //     'attributes.value',
    //     'attributes.attribute.uuid',
    //     'attributes.attribute.name',
    //     'attributes.attribute.unit.uuid',
    //     'attributes.attributeUuid',
    //   ],
    //   where: {
    //     ...where,
    //     isUse: true,
    //   },
    //   attributes: [
    //     [db.sequelize.col('attributes.value'), 'value'],
    //     [db.sequelize.col('attributes.attribute.name'), 'name'],
    //     [db.sequelize.col('attributes.attribute.unit.name'), 'unitName'],
    //     [db.sequelize.col('attributes.attributeUuid'), 'uuid'],
    //   ],
    //   include: [{
    //     model: AttributeValue,
    //     through: { attributes: [] },
    //     required: true,
    //     attributes: [],
    //     as: 'attributes',
    //     include: [
    //       {
    //         model: Attribute,
    //         required: true,
    //         attributes: [],
    //         as: 'attribute',
    //         include: [{
    //           model: Unit,
    //           as: 'unit',
    //         }],
    //       },
    //     ],
    //   }],
    // });

    // const result = await AttributeValue.findAll({
    //   distinct: true,
    //   order: [
    //     ['value', 'asc'],
    //     ['attribute', 'name', 'asc'],
    //   ],
    //   group: [
    //     'AttributeValue.uuid',
    //     'AttributeValue.value',
    //     'attribute.uuid',
    //     'attribute.name',
    //     'attribute.unit.uuid',
    //     'products.uuid',
    //   ],
    //   attributes: [
    //     'value',
    //     [db.sequelize.col('attribute.uuid'), 'uuid'],
    //     [db.sequelize.col('attribute.name'), 'name'],
    //     [db.sequelize.col('attribute.unit.name'), 'unitName'],
    //     [db.sequelize.fn('count', db.sequelize.col('products.uuid')), 'count']
    //   ],
    //   include: [
    //     {
    //       model: Product,
    //       where: {
    //         ...where,
    //         isUse: true,
    //       },
    //       through: { attributes: [] },
    //       attributes: [],
    //       as: 'products',
    //     },
    //     {
    //       model: Attribute,
    //       required: false,
    //       attributes: [],
    //       as: 'attribute',
    //       include: [{
    //         model: Unit,
    //         as: 'unit',
    //       }],
    //     },
    //   ],
    // });

    const result = await Attribute.findAll({
      distinct: true,
      order: [
        ['name', 'asc'],
        ['values', 'value', 'asc'],
      ],
      group: [
        'Attribute.uuid',
        'values.uuid',
        'values.value',
        'unit.name',
      ],
      attributes: [
        'uuid',
        'name',
        [db.sequelize.col('unit.name'), 'unitName'],
      ],
      where: {
        isFiltered: true,
      },
      include: [
        {
          model: AttributeValue,
          required: true,
          attributes: ['value'],
          as: 'values',
          include: [{
            model: Product,
            required: true,
            where: {
              ...where,
              isUse: true,
            },
            through: { attributes: [] },
            attributes: [],
            as: 'products',
          }]
        },
        {
          model: Unit,
          attributes: [],
          as: 'unit',
        }
      ],
    });

    result.map(i => console.log(i.toJSON()));

    const finalResult = result.reduce((accum, item) => {
      const attr = item.toJSON();
      accum.push({
        uuid: attr['uuid'],
        name: attr['name'],
        values: [...new Set(attr['values'].map((i) => i['value']))].map((value) => ({
          value: value,
          unitName: attr['unitName'],
        })),
      });
      return accum;
    }, []);

    console.log(finalResult[0])

    return new Result()
      .data(finalResult)
      .build();
  }
}

export default GetAttributesController;
