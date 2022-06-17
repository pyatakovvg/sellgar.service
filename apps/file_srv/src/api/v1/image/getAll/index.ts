
import { BadRequestError } from "@package/errors";
import { Route, Result, Controller } from '@library/app';


interface IQuery {
  size: 'small' | 'middle' | 'large';
}


@Route('get', '/api/v1/images')
class ImageController extends Controller {
  async send(): Promise<any> {
    const {size}: IQuery = super.query;

    if ( ! size || ['small', 'middle', 'large'].indexOf(size) < 0) {
      throw new BadRequestError({code: '20.0.2', message: 'Неверное значение size'});
    }

    const db = super.plugin.get('db');

    const Image = db.models['Image'];

    const result = await Image.findAndCountAll({
      order: [
        ['createdAt', 'desc'],
      ],
      attributes: ['uuid', 'name', 'createdAt'],
    });

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        total: result['count'],
      })
      .build();
  }
}

export default ImageController;
