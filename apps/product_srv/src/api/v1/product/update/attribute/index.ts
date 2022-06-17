
import { Controller } from '@library/app';


class Attribute {
  private parent: Controller;

  constructor(parent: Controller) {
    this.parent = parent;
  }

  async destroy(productUuid: string) {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute } = db.models;

    await ProductAttribute.destroy({
      where: {
        productUuid,
      }
    });
  }

  async getByProductUuid(productUuid: string): Promise<any> {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute } = db.models;

    const result = await ProductAttribute.findAll({
      where: {
        productUuid,
      }
    });

    return result.map((item) => item.toJSON());
  }

  async create(data: Array<any>) {
    const db = this.parent.plugin.get('db');
    const { ProductAttribute } = db.models;

    if (data && !! data.length) {
      await ProductAttribute.bulkCreate(data);
    }
  }
}

export default Attribute;
