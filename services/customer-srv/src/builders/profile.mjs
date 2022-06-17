
import moment from '@sellgar/moment';


export default function(data) {
  return {
    name: data['name'],
    email: data['email'],
    phone: data['phone'],
    birthday: data['birthday'] ? moment(data['birthday']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00') : null,
  };
}
