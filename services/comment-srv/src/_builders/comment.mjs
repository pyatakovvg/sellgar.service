
import moment from '@sellgar/moment';

import themeBuilder from './theme.mjs';
import customerBuilder from './customer.mjs';


export default function comment(data, level = 1) {
  return {
    level,
    uuid: data['uuid'],
    message: data['message'],
    theme: data['theme'] ? themeBuilder(data['theme']) : null,
    customer: data['customer'] ? customerBuilder(data['customer']) : null,
    isAdmin: data['isAdmin'],
    comments: data['comments'] ? data['comments'].map((item) => comment(item, level + 1)) : [],
    createdAt: moment['default'](data['createdAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
    updatedAt: moment['default'](data['updatedAt']).format('YYYY-MM-DD HH:mm:ss.SSSSSS+00:00'),
  };
}
