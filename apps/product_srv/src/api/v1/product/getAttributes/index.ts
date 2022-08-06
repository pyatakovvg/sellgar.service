
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/attributes')
class GetAttributesController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const whereAttr = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Unit = db.models['Unit'];
    const Product = db.models['Product'];
    const Attribute = db.models['Attribute'];
    const AttributeValue = db.models['AttributeValue'];


    if ('groupCode' in data) {
      where['groupCode'] = data['groupCode'];
    }

    if ('categoryCode' in data) {
      where['categoryCode'] = data['categoryCode'];
      whereAttr['categoryCode'] = data['categoryCode'];
    }

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
        'code',
        'name',
        [db.sequelize.col('unit.name'), 'unitName'],
      ],
      where: {
        ...whereAttr,
        // isFiltered: true,
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

    const finalResult = result.reduce((accum, item) => {
      const attr = item.toJSON();
      accum.push({
        code: attr['code'],
        name: attr['name'],
        values: [...new Set(attr['values'].map((i) => i['value']))]
          .map((value) => ({
            value: value,
            unitName: attr['unitName'],
          }))
          .sort((left: any, right: any) => {
            if (left['value'] > right['value']) {
              return 1;
            }
            if (left['value'] < right['value']) {
              return -1;
            }
            return 0;
          }),
      });
      return accum;
    }, []);

    return new Result()
      .data(finalResult)
      .build();
  }
}

export default GetAttributesController;
