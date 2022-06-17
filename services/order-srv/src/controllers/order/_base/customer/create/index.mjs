
import request from "@package/request";


export default async function(userUuid, customer) {
  if ( ! customer) {
    return null;
  }

  const { data } = await request({
    url: process.env['CUSTOMER_API_SRV'] + '/customers',
    method: 'post',
    data: {
      userUuid: userUuid,
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
    type: data['data'],
    name: data['name'],
    phone: data['phone'],
    email: data['email'],
  };
};