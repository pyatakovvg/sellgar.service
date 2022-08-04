
import { Route, Result, Controller } from '@library/app';
import { NotFoundError, BadRequestError } from "@package/errors";

import { Duplex } from 'stream';
import sharp from 'sharp';


interface IParams {
  uuid: string;
}

interface IQuery {
  size: 'thumb' | 'small' | 'middle' | 'large';
}


async function resize(buffer, options) {
  return await sharp(buffer)
    .resize(options['width'], options['height'], {
      kernel: sharp.kernel.nearest,
      fit: 'contain',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .jpeg({
      quality: Number(process.env['IMAGE_GET_QUALITY']),
    })
    .toBuffer();
}

function getSize(size: string) {
  const sizeArray = size.split('x');
  return {
    w: Number(sizeArray[0]),
    h: Number(sizeArray[1]),
  }
}

@Route('get', '/api/v1/images/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const { size }: IQuery = super.query;
    const { uuid }: IParams = super.params;

    if ( ! size || ! /^(\d+)x(\d+)$/.test(size)) {
      throw new BadRequestError({ code: '100.0.2', message: 'Неверное значение size' });
    }

    const db = super.plugin.get('db');

    const Image = db.models['Image'];

    const image = await Image.findOne({
      where: { uuid },
      attributes: ['large'],
    });

    if ( ! image) {
      throw new NotFoundError({ code: '100.0.1', message: 'Файл не найден' });
    }

    const stream = new Duplex();
    const sizeImage = getSize(size);
    const buffer = await resize(image['large'], {
      width: sizeImage['w'],
      height: sizeImage['h'],
    });

    stream.push(buffer);
    stream.push(null);

    return new Result()
      .data(stream)
      .stream();
  }
}

export default ImageController;
