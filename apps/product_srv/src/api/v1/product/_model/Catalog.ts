
class CatalogModel {
  private db: any = null;

  constructor(db: any) {
    this.db = db;
  }

  async getOne(uuid: string) {
    const Catalog = this.db.model['Catalog'];
    const queryBuilder = this.db.manager.createQueryBuilder(Catalog, 'catalog');

    return await queryBuilder
      .select('catalog')

      .where('catalog.uuid = :catalogUuid', { catalogUuid: uuid })

      .leftJoin('catalog.images', 'product_image')
      .addSelect(['product_image.uuid'])
      .leftJoin('product_image.image', 'p_image')
      .addSelect(['p_image.uuid', 'p_image.name'])
      .addOrderBy('product_image.order', 'ASC')

      .leftJoinAndSelect('catalog.images', 'images')
      .leftJoinAndSelect('images.image', 'c_image')
      .addOrderBy('images.order', 'ASC')

      .leftJoinAndSelect('catalog.group', 'group')
      .leftJoinAndSelect('catalog.category', 'category')

      .leftJoinAndSelect('catalog.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('brand.images', 'b_image')
      .leftJoinAndSelect('product.currency', 'currency')
      .addOrderBy('products.order', 'ASC')

      .leftJoin('catalog.attributes', 'attribute')
      .addSelect(['attribute.uuid', 'attribute.name'])
      .addOrderBy('attribute.order', 'ASC')

      .leftJoin('attribute.values', 'value')
      .addSelect(['value.uuid', 'value.value'])
      .addOrderBy('value.order', 'ASC')

      .leftJoin('value.attribute', 'value_attribute')
      .addSelect(['value_attribute.uuid', 'value_attribute.code', 'value_attribute.name', 'value_attribute.description'])

      .leftJoin('value_attribute.unit', 'unit')
      .addSelect(['unit.uuid', 'unit.name', 'unit.description'])

      .getOne();
  }

  async save(data: any) {
    const Catalog = this.db.model['Catalog'];
    const repProduct = this.db.manager.getRepository(Catalog);

    let preloadData = {};

    if ('uuid' in data) {
      preloadData['uuid'] = data['uuid'];
    }
    if ('externalId' in data) {
      preloadData['externalId'] = data['externalId'];
    }
    if ('name' in data) {
      preloadData['name'] = data['name'];
    }
    if ('description' in data) {
      preloadData['description'] = data['description'];
    }

    if ('isUse' in data) {
      preloadData['isUse'] = data['isUse'];
    }

    if ('groupUuid' in data) {
      preloadData['group'] = { uuid: data['groupUuid'] };
    }
    if ('categoryUuid' in data) {
      preloadData['category'] = { uuid: data['categoryUuid'] };
    }

    if ('images' in data) {
      preloadData['images'] = data['images'].map((image: any, index: number) => ({
        image: { uuid: image['uuid'] },
        order: index,
      }));
    }

    if ('products' in data) {
      preloadData['products'] = data['products'].map((product: any, index: number) => ({
        uuid: product['uuid'] || undefined,
        label: product['label'],
        isTarget: product['isTarget'],
        product: { uuid: product['productUuid'] },
        order: index,
      }));
    }

    if ('attributes' in data) {
      preloadData['attributes'] = data['attributes'].map((group: any, index: number) => ({
        uuid: group['uuid'] || undefined,
        name: group['name'],
        values: group['values'].map((attribute: any, index: number) => ({
          uuid: attribute['uuid'],
          value: attribute['value'],
          attribute: { uuid: attribute['attributeUuid'] },
          order: index,
        })),
        order: index,
      }));
    }

    if ('uuid' in preloadData) {
      const product = await repProduct.preload(preloadData);
      return await repProduct.save(product, { reload: true });
    }
    return await repProduct.save(preloadData, { reload: true });
  }
}

export default CatalogModel;
