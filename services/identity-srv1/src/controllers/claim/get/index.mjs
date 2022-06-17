
import { models } from '@sellgar/db';

import claimBuilder from "../../../builders/claim.mjs";


export default () => async (ctx) => {
  const { Claim } = models;

  const result = await Claim.findAll({
    attributes: ['uuid', 'type', 'description'],
  });

  ctx.body = {
    success: true,
    data: result.map((item) => claimBuilder(item.toJSON())),
  };
};
