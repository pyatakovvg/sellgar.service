
import { Controller } from '@library/app';


class Modes {
  private parent: Controller;

  constructor(parent: Controller) {
    this.parent = parent;
  }

  async destroy(productUuid: string) {
    const db = this.parent.plugin.get('db');
    const { ProductMode } = db.models;

    await ProductMode.destroy({
      where: {
        productUuid,
      }
    });
  }

  async getByProductUuid(productUuid: string): Promise<any> {
    const db = this.parent.plugin.get('db');
    const { ProductMode } = db.models;

    const result = await ProductMode.findAll({
      where: {
        productUuid,
      }
    });

    return result.map((item) => item.toJSON());
  }

  async create(data: Array<any>) {
    const db = this.parent.plugin.get('db');
    const { ProductMode } = db.models;

    if (data && !! data.length) {
      await ProductMode.bulkCreate(data);
    }
  }
}

export default Modes;
