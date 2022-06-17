
import { models } from "@sellgar/db";


export default () => async (ctx) => {
  const { Subscription } = models;
  const data = ctx['request']['body'];

  await Subscription.destroy({
    where: {
      userUuid: data['userUuid'],
      endpoint: data['endpoint'],
    },
  });

  ctx.body = {
    success: true,
    data: null,
  };
};
