
import { models } from '@sellgar/db';
import { sendEvent } from "@sellgar/rabbit";



export default () => async (ctx) => {
  const { uuid } = ctx['params'];
  const data = ctx['request']['body'];

  const { Gallery } = models;

  await Gallery.update({
    name: data['name'],
  }, {
    where: {
      uuid,
    }
  });

  const result = await Gallery.findOne({
    attributes: ['uuid', 'name'],
    where: {
      uuid,
    },
  });

  const image = result.toJSON()

  await sendEvent(process.env['EXCHANGE_IMAGE_UPDATE'], JSON.stringify(image));

  ctx.status = 200;
  ctx.body = {
    success: true,
    data: image,
  };
};
