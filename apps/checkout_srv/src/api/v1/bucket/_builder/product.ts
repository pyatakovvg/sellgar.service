
export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['catalog']['externalId'],

    name: data['catalog']['name'],
    vendor: data['vendor'],

    image: data['catalog']['image'],

    groupCode: data['catalog']['groupCode'],
    categoryCode: data['catalog']['categoryCode'],

    price: Number(data['price']),
    currency: data['currency'],
  };
}
