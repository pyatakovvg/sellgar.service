
export default function category(data) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
  };
}