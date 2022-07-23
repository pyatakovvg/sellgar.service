
import { UUID } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import fs from 'fs';
import sharp from 'sharp';


async function resize(buffer, options) {
  return await sharp(buffer)
    .resize(options['width'], options['height'], {
      kernel: sharp.kernel.nearest,
      fit: 'contain',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .jpeg({
      quality: 90,
    })
    .toBuffer();
}


@Route('post', '/api/v1/images')
class ImageController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');

    const Image = db.models['Image'];

    let files = super.ctx.request.files['files[]']

    if ( ! (files instanceof Array)) {
      files = new Array(files);
    }

    const bulkImages = [];
    for (let index in files) {
      if (files.hasOwnProperty(index)) {
        const file = files[index];
        const reader = fs.readFileSync(file['filepath']);
        const imageBuffer = Buffer.from(reader);

        const thumbImgBuffer = await resize(imageBuffer, {
          width: Number(process.env['IMAGE_THUMB_SIZE_WIDTH']),
          height: Number(process.env['IMAGE_THUMB_SIZE_HEIGHT']),
        });
        const smallImgBuffer = await resize(imageBuffer, {
          width: Number(process.env['IMAGE_SMALL_SIZE_WIDTH']),
          height: Number(process.env['IMAGE_SMALL_SIZE_HEIGHT']),
        });
        const middleImgBuffer = await resize(imageBuffer, {
          width: Number(process.env['IMAGE_MIDDLE_SIZE_WIDTH']),
          height: Number(process.env['IMAGE_MIDDLE_SIZE_HEIGHT']),
        });
        const largeImgBuffer = await resize(imageBuffer, {
          width: Number(process.env['IMAGE_LARGE_SIZE_WIDTH']),
          height: Number(process.env['IMAGE_LARGE_SIZE_HEIGHT']),
        });

        bulkImages.push({
          uuid: UUID(),
          name: file['originalFilename'].replace(/\.\w+$/, '.jpg'),
          thumb: thumbImgBuffer,
          small: smallImgBuffer,
          middle: middleImgBuffer,
          large: largeImgBuffer,
        });
      }
    }

    const result = await Image.bulkCreate(bulkImages);

    return new Result()
      .data(result.map((img) => img.toJSON()))
      .build();
  }
}

export default ImageController;
