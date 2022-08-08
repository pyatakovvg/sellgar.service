
import category from './category';


export default function(data) {
  return {
    code: data['code'],
    icon: data['icon'],
    name: data['name'],
    imageUuid: data['imageUuid'],
    description: data['description'],
    productsCount: Number(data['productsCount']),
    categories: data['categories'] ? data['categories'].map(category) : [],
  };
}