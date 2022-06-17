
import { models } from '@sellgar/db';

import permissionBuilder from "../../../builders/permission.mjs";


export default () => async (ctx) => {
  const { Permission } = models;

  const result = await Permission.findAll({
    attributes: ['uuid', 'code', 'displayName'],
  });

  ctx.body = {
    success: true,
    data: result.map((item) => permissionBuilder(item.toJSON())),
  };
};
