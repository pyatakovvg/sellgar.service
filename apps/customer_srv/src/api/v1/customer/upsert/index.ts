
import { Route, Result, Controller } from '@library/app';

import CustomerModel from '../_models/Customer';
import customerBuilder from '../_builder/customer';


@Route('post', '/api/v1/customers')
class UpdateCustomerController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const rabbit = super.plugin.get('rabbit');
    const db = super.plugin.get('db');
    const Customer = db.model['Customer'];


    const model = new CustomerModel(db);
    const repository = db.manager.getRepository(Customer);

    const customerUpdate = await repository.save({
      uuid: body['uuid'],
      name: body['name'],
      phone: body['phone'],
      email: body['email'],
    }, { reload: true });

    const result = await model.getOne({
      uuid: customerUpdate['uuid'],
    });

    await rabbit.sendEvent(process.env['CUSTOMER_SRV_CUSTOMER_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(result ? customerBuilder(result) : null)
      .build();
  }
}

export default UpdateCustomerController;
