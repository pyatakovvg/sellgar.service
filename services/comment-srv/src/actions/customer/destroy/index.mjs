
import { models } from '@sellgar/db';


export default async function(data) {
  const { Customer } = models;

  await Customer.destroy({
    where: {
      uuid: data['uuid'],
    },
  });
}
