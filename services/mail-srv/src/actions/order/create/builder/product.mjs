
import numeral from '@sellgar/numeral';


export default function(data) {
  return {
    uuid: data['uuid'],
    productUuid: data['productUuid'],
    orderUuid: data['orderUuid'],
    title: data['title'],
    currency: data['currency'],
    number: data['number'],
    price: numeral(data['price']).format(),
    finalPrice: numeral(data['price'] * data['number']).format(),
    value: data['value'],
    vendor: data['vendor'],
  };
}
