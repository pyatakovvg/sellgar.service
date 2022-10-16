
import productBuilder from './product';


export default function(data: any) {
  const product = productBuilder(data['product']);
  return {
    uuid: data['uuid'],
    count: data['count'],
    product: product,
    fullPrice: Math.round(product['price'] * data['count'])
  };
}