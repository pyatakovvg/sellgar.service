
import { Controller } from '@library/app';


class Gallery {
  private parent: Controller;

  constructor(parent: Controller) {
    this.parent = parent;
  }

  async destroy(productUuid: string) {
    const db = this.parent.plugin.get('db');
    const { ProductGallery } = db.models;

    await ProductGallery.destroy({
      where: {
        productUuid,
      }
    });
  }

  async getByProductUuid(productUuid: string): Promise<any> {
    const db = this.parent.plugin.get('db');
    const { ProductGallery } = db.models;

    const result = await ProductGallery.findAll({
      where: {
        productUuid,
      }
    });

    return result.map((item) => item.toJSON());
  }

  async create(data: Array<any>) {
    const db = this.parent.plugin.get('db');
    const { ProductGallery } = db.models;

    if (data && !! data.length) {
      await ProductGallery.bulkCreate(data);
    }
  }
}

export default Gallery;
