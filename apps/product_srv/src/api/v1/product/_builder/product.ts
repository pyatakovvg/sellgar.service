
import brandBuilder from './brand';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    label: data['label'],
    isTarget: data['isTarget'],
    product : {
      uuid: data['product']['uuid'],

      name: data['product']['name'],
      description: data['product']['description'],

      brand: data['product']['brand'] ? brandBuilder(data['product']['brand']) : null,

      barcode: data['product']['barcode'],
      vendor: data['product']['vendor'],

      count: Number(data['product']['count']),
      reserve: Number(data['product']['reserve']),

      price: Number(data['product']['price']),
      purchasePrice: Number(data['product']['purchasePrice']),
      currency: data['product']['currency'],

      createdAt: data['createdAt'],
      updatedAt: data['updatedAt'],
    },
  };
}