
import categoryBuilder from './category.mjs';
import productBuilder from './product.mjs';


export default function category(data) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    name: data['name'],
    description: data['description'],
    productsCount: data['productsCount'] ?? undefined,
    products: data['products'] ? data['products'].map((item) => productBuilder(item)) : undefined,
    categories: data['categories'] ? data['categories'].map((item) => categoryBuilder(item)) : undefined,
  };
}