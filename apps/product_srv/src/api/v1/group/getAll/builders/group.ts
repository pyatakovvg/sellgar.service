
import category from './category';


export default function(data) {
  return {
    code: data['code'],
    name: data['name'],
    description: data['description'],
    productsCount: Number(data['productsCount']),
    categories: data['categories'] ? data['categories'].map(category) : [],
  };
}