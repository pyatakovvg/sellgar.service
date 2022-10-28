
class StoreModel {
  private db: any = null;
  private manager: any = null;

  constructor(db: any, manager: any) {
    this.db = db;
    this.manager = manager;
  }

  async getOne(params: any) {
    const Bucket = this.db.model['Bucket'];
    const queryBuilder = this.manager.createQueryBuilder(Bucket, 'bucket');

    return await queryBuilder
      .andWhere('bucket.uuid = :bucketUuid', {
        bucketUuid: params['bucketUuid'],
      })
      .innerJoin('bucket.customer', 'customer', 'customer.uuid = :customerUuid', {
        customerUuid: params['customerUuid'],
      })
      .leftJoinAndSelect('bucket.currency', 'b_currency')
      .leftJoinAndSelect('bucket.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .leftJoinAndSelect('product.currency', 'p_currency')
      .leftJoinAndSelect('product.product', 'catalog_product')
      .leftJoinAndSelect('catalog_product.catalog', 'catalog')
      .leftJoinAndSelect('catalog.image', 'image')
      .getOne();
  }
}

export default StoreModel;
