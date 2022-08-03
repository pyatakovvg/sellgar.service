
function normalizeValue(value: string) {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  return value;
}


export default function(data: any) {
  return {
    uuid: data['attribute']['uuid'],
    name: data['attribute']['name'],
    value: normalizeValue(data['value']) || null,
    description: data['attribute']['description'],
    unit: data['attribute']['unit'],
  };
}