
export default function(data: any) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    icon: data['icon'],
    images: data['images'],
    description: data['description'],
    group: data['group'] ?? null,
  };
}