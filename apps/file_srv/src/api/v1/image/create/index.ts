
import { Image as Img } from '@package/sharp';
import { Route, Result, Controller } from '@library/app';

import fs from 'fs';


function getSize(innerWidth: number, innerHeight: number, square: number) {
  const deltaHeight = square * innerHeight / innerWidth;
  if (deltaHeight > square) {
    return { w: null, h: square };
  }
  return { w: square, h: null };
}


@Route('post', '/api/v1/images')
class ImageController extends Controller {
  async send(): Promise<any> {
    const rabbit = super.plugin.get('rabbit');

    const db = super.plugin.get('db2');
    const Image = db.model['Image'];

    let files = super.ctx.request.files;

    const bulkImages = [];
    for (let index in files) {
      if (files.hasOwnProperty(index)) {
        const file = files[index];
        const reader = fs.readFileSync(file['filepath']);
        const innerImage = new Img(Buffer.from(reader));
        const innerMeta = await innerImage.metadata();
        const size = getSize(innerMeta['width'], innerMeta['height'], Number(process.env['IMAGE_SQUARE_SIZE']));

        innerImage.resize(size['w'], size['h']);
        innerImage.toWebp(Number(process.env['IMAGE_QUALITY']));

        const buffer = await innerImage.toBuffer();

        const outputImage = new Img(buffer)
        const outputMeta = await outputImage.metadata();

        bulkImages.push({
          name: file['originalFilename'].replace(/\.\w+$/, '.' + outputMeta['format']),
          size: outputMeta['size'],
          mime: 'image/' + outputMeta['format'],
          width: outputMeta['width'],
          height: outputMeta['height'],
          buffer,
        });
      }
    }

    const repository = db.repository(Image);
    const queryBuilder = repository.createQueryBuilder();

    const created = await queryBuilder
      .insert()
      .into(Image)
      .values(bulkImages)
      .execute();

    const result = await repository
      .createQueryBuilder('image')
      .select(['image.uuid', 'image.name', 'image.size', 'image.mime', 'image.width', 'image.height'])
      .where('image.uuid IN (:...uuid)', {
        uuid: created['identifiers'].map(i => i['uuid']),
      })
      .orderBy('image.createdAt', 'DESC')
      .getMany();

    await rabbit.sendEvent(process.env['FILE_SRV_IMAGE_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(result)
      .build();
  }
}

export default ImageController;
