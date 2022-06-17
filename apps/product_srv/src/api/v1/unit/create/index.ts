
import { Route, Result, Controller } from '@library/app';

import Saga from "./saga";
import SagaParams, { IParams } from "./saga-params";

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('post', '/api/v1/units')
class CreateUnitController extends Controller {
  async send(): Promise<any> {
    // const ajv = new Ajv();
    // const validation = ajv.compile(unitScheme);
    //
    // if (!validation(body)) {
    //   throw new BadRequestError({code: '10', message: validation['errors'][0]['message']});
    // }

    const sagaParams = new SagaParams();
    const saga = new Saga(this);

    const params: IParams = await saga.execute(sagaParams);
    const result = params.getResult();

    return new Result()
      .data(result)
      .build();
  }
}

export default CreateUnitController;
