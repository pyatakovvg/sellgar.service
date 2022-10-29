
class StoreModel {
  private db: any = null;
  private manager: any = null;

  constructor(db: any) {
    this.db = db;
  }

  async getOne(params: any) {
    const Customer = this.db.model['Customer'];
    const queryBuilder = this.db.manager.createQueryBuilder(Customer, 'customer');

    return await queryBuilder
      .andWhere('customer.uuid = :customerUuid', {
        customerUuid: params['uuid'],
      })

      .getOne();
  }
}

export default StoreModel;
