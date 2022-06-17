
export default function(data) {
  return {
    uuid: data['uuid'],
    type: data['type'],
    description: data['description'],
    value: data['UserClaim'] ? data['UserClaim']['value'] : undefined,
  };
}