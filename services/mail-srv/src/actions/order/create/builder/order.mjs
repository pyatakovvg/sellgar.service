
import moment from '@sellgar/moment';
import numeral from '@sellgar/numeral';

import productBuilder from './product.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    address: data['address'],
    dateTo: moment(data['dateTo']).format('DD.MM.YYYY HH:mm'),
    description: data['description'],
    status: data['status'],
    title: data['title'],
    updatedAt: data['updatedAt'],
    userUuid: data['userUuid'],
    products: data['products'].map((item) => productBuilder(item)),
    finalPrice: numeral(data['products'].reduce((prev, value) => prev + (value['price'] * value['number']), 0)).format(),
  };
}
