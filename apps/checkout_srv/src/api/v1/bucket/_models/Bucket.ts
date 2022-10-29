
class StoreModel {
  private db: any = null;
  private manager: any = null;

  constructor(db: any) {
    this.db = db;
  }

  async getOne(params: any) {
    const Bucket = this.db.model['Bucket'];
    const queryBuilder = this.db.manager.createQueryBuilder(Bucket, 'bucket');

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

      .addOrderBy('products.order', 'ASC')

      .getOne();
  }
}

export default StoreModel;
