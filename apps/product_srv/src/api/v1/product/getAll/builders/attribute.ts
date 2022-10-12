
export default function(data: any) {
  return {
    uuid: data['uuid'],
    value: data['value'],
    attribute: data['attribute'],
  };
}