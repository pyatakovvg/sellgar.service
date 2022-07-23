
import { Route, Result, Controller } from '@library/app';
import { NotFoundError, BadRequestError } from "@package/errors";

import { Duplex } from 'stream';


interface IParams {
  uuid: string;
}

interface IQuery {
  size: 'thumb' | 'small' | 'middle' | 'large';
}


@Route('get', '/api/v1/images/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const { size }: IQuery = super.query;
    const { uuid }: IParams = super.params;

    if ( ! size || ['thumb', 'small', 'middle', 'large'].indexOf(size) < 0) {
      throw new BadRequestError({ code: '100.0.2', message: 'Неверное значение size' });
    }

    const db = super.plugin.get('db');

    const Image = db.models['Image'];

    const image = await Image.findOne({
      where: { uuid },
      attributes: [size],
    });

    if ( ! image) {
      throw new NotFoundError({ code: '100.0.1', message: 'Файл не найден' });
    }

    const stream = new Duplex();

    stream.push(image[size]);
    stream.push(null);

    return new Result()
      .data(stream)
      .stream();
  }
}

export default ImageController;
