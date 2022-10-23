
import { Route, Result, Controller } from '@library/app';

import Store from '../_models/Store';


@Route('post', '/api/v1/store')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    // const rabbit = super.plugin.get('rabbit');

    const db = super.plugin.get('db');
    const store = new Store(db);

    const item = await store.save(body);
    const result = await store.getOne(item['uuid']);

    return new Result()
      .data(result)
      .build();
  }
}

export default UpdateProductTemplateController;
