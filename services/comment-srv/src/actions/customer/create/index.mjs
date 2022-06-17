
import { models } from '@sellgar/db';


export default async function(data) {
  const { Customer } = models;

  await Customer.create({
    uuid: data['uuid'],
    name: data['profile']['name'],
    phone: data['profile']['phone'],
    email: data['profile']['email'],
  });
}
