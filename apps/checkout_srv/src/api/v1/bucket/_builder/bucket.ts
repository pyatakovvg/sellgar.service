
import bucketProductBuilder from './bucketProduct';


export default function(data: any) {
  const products = data['products'].map(bucketProductBuilder);

  return {
    products,
    uuid: data['uuid'],
    currency: data['currency'],
    count: products.reduce((accum, item) => accum + item['count'], 0),
    price: products.reduce((accum, item) => accum + item['fullPrice'], 0),
  };
}
