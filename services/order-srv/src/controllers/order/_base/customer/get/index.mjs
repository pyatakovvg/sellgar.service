
import { models } from "@sellgar/db";


export default async function(params) {
  const { Customer } = models;

  const result = await Customer.findAll({
    where: {
      ...params,
    },
  });

  if (result) {
    return result.map((item) => item.toJSON());
  }
  return null;
};