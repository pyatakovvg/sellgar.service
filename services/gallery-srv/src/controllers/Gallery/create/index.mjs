
import { UUID } from '@sellgar/utils';
import { getFiles } from '@sellgar/utils';
import { models, Sequelize } from '@sellgar/db';

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
      quality: 85,
    })
    .toBuffer();
}


export default () => async (ctx) => {
  const { Gallery } = models;
  const { files } = await getFiles(ctx['req']);

  const bulkImages = [];
  for (let index in files) {
    if (files.hasOwnProperty(index)) {
      const uuid = UUID();
      const file = files[index];
      let fileName = file['fileName']
        ? file['fileName'].replace(/(\.\w+)$/, '').slice(0, 31)
        : null;

      if (fileName) {
        const result = await Gallery.findAll({
          attributes: ['name'],
          order: [
            ['name', 'asc']
          ],
          where: {
            name: {
              [Sequelize.Op.like]: `${fileName}%`,
            },
          }
        });
        const data = result.map(item => item.toJSON());
        let maxCountInFile = 0;

        for (let index in data) {
          if (data.hasOwnProperty(index)) {
            const name = data[index]['name'];
            const regExp = new RegExp(`^${fileName}(\\[(.*)\\])?$`);
            const isMatch = name.match(regExp);
            if (isMatch) {
              if (Number(isMatch[2]) >= maxCountInFile) {
                maxCountInFile = Number(isMatch[2]) + 1;
              }
            }
          }
        }

        if (maxCountInFile > 0) {
          fileName += `[${maxCountInFile}]`;
        }
      }

      const smallImgBuffer = await resize(file['buffer'], { width: 124, height: 124 });
      const middleImgBuffer = await resize(file['buffer'], { width: 320, height: 320 });
      const largeImgBuffer = await resize(file['buffer'], { width: 840, height: 840 });

      const fileUuid = `${uuid}.jpg`;

      bulkImages.push({
        uuid: fileUuid,
        name: fileName,
        small: smallImgBuffer,
        middle: middleImgBuffer,
        large: largeImgBuffer,
      });
    }
  }

  await Gallery.bulkCreate(bulkImages);

  ctx.status = 200;
  ctx.body = {
    success: true,
    data: bulkImages.map((img) => ({ uuid: img['uuid'], name: img['name'] })),
  };
};
