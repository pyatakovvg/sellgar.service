
import { models } from '@sellgar/db';


export default async(includeAt) => {
  const { Category, Brand } = models;
  const includedModels = [];

  if (includeAt.includes('brand')) {
    includedModels.push({
      model: Brand,
      throw: {},
      as: 'brands',
    });
  }
  const result = await Category.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'code', 'name', 'description'],
    include: includedModels,
  });

  return result.map((theme) => theme.toJSON());
}
