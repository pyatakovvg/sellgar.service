
import unitBuilder from './unit.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    attributeUuid: data?.['ProductAttribute']?.['attributeUuid'] || undefined,
    value: data?.['ProductAttribute']?.['value'] || undefined,
    description: data['description'],
    unit: data['unit'] ? unitBuilder(data['unit']) : null,
  };
}