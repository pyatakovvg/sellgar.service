
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/payments')
class ImageController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const query = super.query;
    const db = super.plugin.get('db');

    const Payment = db.models['Payment'];

    if ('isUse' in query) {
      where['isUse'] = query['isUse'] === 'true';
    }

    const result = await Payment.findAll({
      where,
      order: [
        ['order', 'asc'],
      ],
      attributes: ['code', 'displayName', 'description', 'isUse'],
    });

    return new Result()
      .data(result.map((item) => item.toJSON()))
      .build();
  }
}

export default ImageController;
