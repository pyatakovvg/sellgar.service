
import moment from '@sellgar/moment';

import commentBuilder from './comment.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    title: data['title'],
    comments: data['comments'] ? data['comments'].map((item) => commentBuilder(item)) : [],
    createdAt: moment['default'](data['createdAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
    updatedAt: moment['default'](data['updatedAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
  };
}
