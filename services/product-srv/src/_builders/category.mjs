
import brandBuilder from './brand.mjs';


export default function(data) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
    brands: data['brands'] ? data['brands'].map((item) => brandBuilder(item)) : undefined,
  };
}