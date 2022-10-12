
import attrBuilder from './attribute';


export default function(data) {
  return {
    uuid: data['uuid'],
    name: data['name'],
    values: data['values'].map(attrBuilder),
  };
}
