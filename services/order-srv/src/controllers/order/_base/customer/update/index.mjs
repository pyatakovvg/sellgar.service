
import request from "@package/request";


export default async function(customer) {
  const { data } = await request({
    url: process.env['CUSTOMER_API_SRV'] + '/customers/' + customer['customerUuid'],
    method: 'put',
    data: {
      uuid: customer['customerUuid'],
      userUuid: customer['uuid'],
      type: 'customer',
      name: customer['name'],
      email: customer['email'],
      phone: customer['phone'],

    },
  });

  if ( ! data) {
    return null;
  }

  return {
    uuid: data['uuid'],
    userUuid: data['userUuid'],
    type: data['type'],
    name: data['name'],
    phone: data['phone'],
    email: data['email'],
  };
};