
import { models } from '@sellgar/db';
import { NotfoundError } from '@package/errors';

import { Duplex } from 'stream';


export default () => async (ctx) => {
  const { Gallery } = models;
  const { id } = ctx['params'];
  const { size = 'large' } = ctx['query'];

  const image = await Gallery.findOne({
    where: { uuid: id },
    attributes: [size],
  });

  const stream = new Duplex();

  if (image) {
    stream.push(image[size]);

    stream.push(null);

    ctx.status = 200;
    ctx.body = stream;
  }
  else {
    throw new NotfoundError({ code: '100.1.1', message: 'Изображение не найдено' });
  }
};
