
export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['product'][0]['catalog']['externalId'],

    name: data['product'][0]['catalog']['name'],
    label: data['product'][0]['label'],

    image: data['product'][0]['catalog']['image'],

    groupCode: data['product'][0]['catalog']['groupCode'],
    categoryCode: data['product'][0]['catalog']['categoryCode'],

    price: Number(data['price']),
    currency: data['currency'],
  };
}
