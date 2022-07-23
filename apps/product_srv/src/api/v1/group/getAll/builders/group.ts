
import category from './category';


export default function(data) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
    productsCount: Number(data['productsCount']),
    categories: data['categories'] ? data['categories'].map(category) : [],
  };
}