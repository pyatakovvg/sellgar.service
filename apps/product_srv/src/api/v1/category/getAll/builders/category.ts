
import groupBuilder from './group';


export default function(data: any) {
  return {
    name: data['name'],
    code: data['code'],
    imageUuid: data['imageUuid'],
    description: data['description'],
    group: groupBuilder(data['group']),
    productsCount: data['productsCount'],
  };
}