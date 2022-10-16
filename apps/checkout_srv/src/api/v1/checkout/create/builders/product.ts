
export default function(data: any) {
  return {
    uuid: data['uuid'],
    externalId: data['externalId'],
    title: data['title'],
    image: data['image'],
    groupCode: data['groupCode'],
    categoryCode: data['categoryCode'],
    price: Number(data['price']),
    currency: data['currency'],
  };
}