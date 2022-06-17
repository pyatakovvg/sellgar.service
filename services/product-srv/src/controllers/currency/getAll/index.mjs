
import { models } from '@sellgar/db';


export default () => async (ctx) => {
  const { Currency } = models;

  const result = await Currency.findAll();

  ctx.body = {
    success: true,
    data: result.map((item) => item.toJSON()),
  };
};
