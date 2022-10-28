
import productBuilder from './product';


export default function(data: any) {
  const product = productBuilder(data['product']);

  return {
    product,
    count: data['count'],
    fullPrice: product['price'] * data['count'],
  };
}
