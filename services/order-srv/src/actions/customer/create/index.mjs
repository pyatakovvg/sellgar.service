
import { models } from '@sellgar/db';


export default async function create(data) {
  const { Customer } = models;

  await Customer.create({
    uuid: data['userUuid'],
    customerUuid: data['uuid'],
    type: data['type'],
    name: data['name'],
    phone: data['phone'],
    email: data['email'],
  });
}
