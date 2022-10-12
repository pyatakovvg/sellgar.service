
export default function(data: any): any {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
    image: data?.['images']?.[0] ?? null,
  };
}
