
export default function(data: any) {
  return {
    code: data['code'],
    name: data['name'],
    imageUuid: data['imageUuid'],
    description: data['description'],
  };
}