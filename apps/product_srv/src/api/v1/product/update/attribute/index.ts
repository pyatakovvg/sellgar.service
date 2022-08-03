
import { Controller } from '@library/app';


class Attribute {
  private parent: Controller;

  constructor(parent: Controller) {
    this.parent = parent;
  }

  async destroy(productUuid: string) {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute, AttributeValue } = db.models;

    const values = await ProductAttribute.findAll({
      row: true,
      where: {
        productUuid,
      }
    });

    await AttributeValue.destroy({
      where: {
        uuid: values.map(i => i['attributeUuid']),
      }
    });
    await ProductAttribute.destroy({
      where: {
        productUuid,
      }
    });
  }

  async getByProductUuid(productUuid: string): Promise<any> {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute, AttributeValue } = db.models;

    const result = await ProductAttribute.findAll({
      where: {
        productUuid,
      },
      include: [{
        model: AttributeValue,
        attributes: ['value'],
        as: 'value',
      }],
    });

    return result.map((item) => item.toJSON());
  }

  async create(data: Array<any>) {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute, AttributeValue } = db.models;

    if (data && !! data.length) {
      const valuesResult = await AttributeValue.bulkCreate(data.map((item: any) => ({ attributeUuid: item['attributeUuid'], value: item['value'] })));
      const values = valuesResult.map((item: any) => item.toJSON());
      await ProductAttribute.bulkCreate(values.reduce((accum, item) => {
        accum.push({
          attributeUuid: item['uuid'],
          productUuid: data.find((a) => a['attributeUuid'] === item['attributeUuid'])['productUuid'],
        });
        return accum;
      }, []));
    }
  }
}

export default Attribute;
