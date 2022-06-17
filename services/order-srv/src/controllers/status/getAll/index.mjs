
import { models } from '@sellgar/db';


export default () => async (ctx) => {
  const { Status } = models;

  const result = await Status.findAll();

  ctx.body = {
    success: true,
    data: result.map((item) => item.toJSON()),
  };
};
