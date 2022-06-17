
import request from "@package/request";


export default async function(customerUuid) {
  await request({
    url: process.env['CUSTOMER_API_SRV'] + '/customers',
    method: 'delete',
    data: {
      uuid: customerUuid,
    },
  });
};