
export default function(data: any) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
  };
}
