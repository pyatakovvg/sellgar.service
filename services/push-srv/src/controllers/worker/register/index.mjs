
import { models } from '@sellgar/db';


export default () => async (ctx) => {
  const { Subscription } = models;
  const data = ctx['request']['body'];

  await Subscription.create({
    userUuid: data['userUuid'],
    endpoint: data['endpoint'],
    auth: data['keys']['auth'],
    p256dh: data['keys']['p256dh'],
  });

  ctx.body = {
    success: true,
    data: null,
  };
};
