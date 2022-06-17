
import moment from '@sellgar/moment';


export default function(data) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    email: data['email'],
    phone: data['phone'],
    createdAt: moment['default'](data['createdAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
    updatedAt: moment['default'](data['updatedAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
  };
}
