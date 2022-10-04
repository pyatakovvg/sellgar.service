
export default function(data: any) {
  return {
    uuid: data['uuid'],
    value: data['value'],
    attributeUuid: data['attribute']['uuid'],
    unit: data['attribute']['unit'],
  };
}