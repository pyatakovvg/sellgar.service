
export default function(data: any) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
  };
}