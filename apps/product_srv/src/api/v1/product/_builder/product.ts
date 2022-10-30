
import brandBuilder from './brand';


export default function(data: any) {
  return {
    uuid: data['uuid'],

    name: data['name'],
    description: data['description'],

    brand: data['brand'] ? brandBuilder(data['brand']) : null,

    barcode: data['barcode'],
    vendor: data['vendor'],

    count: Number(data['count']),
    reserve: Number(data['reserve']),

    price: Number(data['price']),
    purchasePrice: Number(data['purchasePrice']),
    currency: data['currency'],
  };
}