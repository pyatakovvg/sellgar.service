
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/claim')
class ClaimGetController extends Controller {
  async send(): Promise<any> {
    const db: any = super.plugin.get('db');
    const Claim = db.model.get('Claim');

    const result = await Claim.findAll({
      attributes: ['uuid', 'type', 'description'],
    });

    return new Result()
      .data(result.map((item) => item.toJSON()))
      .build();
  }
}

export default ClaimGetController;