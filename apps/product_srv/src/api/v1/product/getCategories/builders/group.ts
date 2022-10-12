
export default function(data: any): any {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    products: data['products'],
    description: data['description'],
    image: data?.['images']?.[0] ?? null,
    icon: data?.['icon']?.[0] ?? null,
  };
}