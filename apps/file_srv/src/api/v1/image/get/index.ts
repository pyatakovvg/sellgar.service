
import { Image as Img } from '@package/sharp';
import { Route, Result, Controller } from '@library/app';
import { NotFoundError, BadRequestError } from "@package/errors";

import { Duplex } from 'stream';


interface IParams {
  uuid: string;
}

interface IQuery {
  width: string;
  height: string;
}


@Route('get', '/api/v1/images/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const { width, height }: IQuery = super.query;
    const { uuid }: IParams = super.params;

    if ((width && ! /^\d+$/.test(width)) || (height && ! /^\d+$/.test(height))) {
      throw new BadRequestError({ code: '100.0.2', message: 'Неверное значение размера' });
    }

    const db = super.plugin.get('db2');
    const Image = db.model['Image'];

    const repository = db.repository(Image);
    const queryBuilder = repository.createQueryBuilder('image')

    const result = await queryBuilder
      .select(['image.uuid', 'image.buffer'])
      .where('image.uuid = :uuid', { uuid })
      .getOne();

    if ( ! result) {
      throw new NotFoundError({ code: '100.0.1', message: 'Файл не найден' });
    }

    const image = new Img(result['buffer']);

    if ( !! width || !! height) {
      console.log(Number(width) ?? null, Number(height) ?? null)
      image.resize(Number(width) ?? null, Number(height) ?? null);
    }

    const outerImage = await image.toBuffer();

    const stream = new Duplex();

    stream.push(outerImage);
    stream.push(null);

    return new Result()
      .data(stream)
      .stream();
  }
}

export default ImageController;
