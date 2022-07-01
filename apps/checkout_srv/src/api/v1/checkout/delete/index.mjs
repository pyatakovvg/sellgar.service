
import { models } from '@sellgar/db';
import { sendEvent } from '@sellgar/rabbit';


export default () => async (ctx) => {
  const data = ctx['request']['body'];
  const { Gallery } = models;

  await Gallery.destroy({ where: { uuid: data['uuid'] }});

  await sendEvent(process.env['EVENT_IMAGE_DELETE'], JSON.stringify(data['uuid']));

  ctx.body = {
    success: true,
    data,
  };
};
