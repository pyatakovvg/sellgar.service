
import bucketProductBuilder from './bucketProduct';


export default function(data: any) {
  const products = data['products'].map(bucketProductBuilder);
  const price = products.reduce((accum, item) => accum + item['fullPrice'], 0);
  const currency = products.reduce((accum, item) => {
    if (accum?.['code'] !== item['product']['currency']['code']) {
      accum = item['product']['currency'];
    }
    return accum;
  }, {});

  return {
    uuid: data['uuid'],
    price: price,
    currency: currency,
    products: products,
    count: products.reduce((accum, item) => accum + item['count'], 0),
  };
}