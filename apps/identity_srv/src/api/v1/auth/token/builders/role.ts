
import permissionBuilder from './permission';


export default function(data) {
  return {
    uuid: data['uuid'],
    code: data['code'],
    displayName: data['displayName'],
    permissions: data['permissions'].map((permission) => permissionBuilder(permission)),
  };
}