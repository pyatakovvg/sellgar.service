
import { Route, Result, Controller } from '@library/app';

import Saga from "./saga";
import SagaParams, { IParams } from "./saga-params";

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('put', '/api/v1/products/:uuid')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {

    // const ajv = new Ajv();
    // const validation = ajv.compile(updateProductScheme);
    //
    // if (!validation(body)) {
    //   throw new BadRequestError({code: '20', message: validation.errors['0']['message']});
    // }

    const saga = new Saga(this);
    const sagaParams = new SagaParams();

    const params: IParams = await saga.execute(sagaParams);
    const result = params.getResult();

    return new Result()
      .data(result)
      .build();
  }
}

export default UpdateProductTemplateController;
