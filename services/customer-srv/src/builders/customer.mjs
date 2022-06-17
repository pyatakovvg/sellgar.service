
import moment from '@sellgar/moment';

import profileBuilder from './profile.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    profile: profileBuilder(data['profile']),
    createdAt: moment(data['createdAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
    updatedAt: moment(data['updatedAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
  };
}
