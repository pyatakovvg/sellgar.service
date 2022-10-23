
export default function(data: any) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    description: data['description'],

    vendor: data['vendor'],
    barcode: data['barcode'],

    count: Number(data['count']),
    reserve: Number(data['reserve']),

    price: Number(data['price']),
    purchasePrice: Number(data['purchasePrice']),
    currency: data['currency'],

    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}