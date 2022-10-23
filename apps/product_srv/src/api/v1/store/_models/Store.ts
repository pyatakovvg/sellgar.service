
class StoreModel {
  private db: any = null;

  constructor(db: any) {
    this.db = db;
  }

  async getOne(uuid: string) {
    const Store = this.db.model['Store'];
    const queryBuilder = this.db.manager.createQueryBuilder(Store, 'store');

    return await queryBuilder
      .select([
        'store.uuid',
        'store.name', 'store.description',
        'store.price', 'store.purchasePrice',
        'store.count', 'store.reserve',
        'store.vendor', 'store.barcode',
        'store.createdAt', 'store.updatedAt'
      ])
      .where('store.uuid = :uuid', { uuid })
      .leftJoinAndSelect('store.brand', 'brand')
      .leftJoinAndSelect('store.currency', 'currency')
      .getOne();
  }

  async save(data: any) {
    const Store = this.db.model['Store'];
    const repository = this.db.manager.getRepository(Store);

    return await repository.save(data, { reload: true });
  }
}

export default StoreModel;
