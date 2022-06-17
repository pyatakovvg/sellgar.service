
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Customer } = models;

  await Customer.destroy({
    where: {
      uuid,
    }
  });
}
