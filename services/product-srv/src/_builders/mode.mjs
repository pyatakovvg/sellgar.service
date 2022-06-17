
import currencyBuilder from './currency.mjs';


export default function category(data) {
  return {
    uuid: data['uuid'],
    vendor: data['vendor'],
    value: data['value'],
    price: data['price'],
    isUse: data['isUse'],
    isTarget: data['isTarget'],
    currency: currencyBuilder(data['currency']),
  };
}