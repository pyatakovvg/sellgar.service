
import groupBuilder from './group';


export default function(data: any) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    code: data['code'],
    description: data['description'],
    groups: data['groups'].map((item) => groupBuilder(item)),
  };
}