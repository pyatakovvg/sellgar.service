
import { models } from '@sellgar/db';

import themeBuilder from '../../../_builders/theme.mjs';


export default () => async (ctx) => {
  const { Theme } = models;

  const result = await Theme.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'name'],
  });

  ctx.body = {
    success: true,
    data: result.map((theme) => themeBuilder(theme.toJSON())),
  };
};
