

export default function(data) {
  const result = {};

  result['uuid'] = data['uuid'];
  result['login'] = data['login'];
  result['createdAt'] = data['createdAt'];
  result['updatedAt'] = data['updatedAt'];
  result['claims'] = data['claims'].reduce((accum, claim) => {
    accum[claim['type']] = claim['UserClaim'] ? claim['UserClaim']['value'] : null;
    return accum;
  }, {});
  result['roles'] = data['roles'].map((role) => role['code']);

  result['permissions'] = [];
  for (let role in data['roles']) {
    if (data['roles'].hasOwnProperty(role)) {
      const currentRole = data['roles'][role];
      for (let permission in currentRole['permissions']) {
        if (currentRole['permissions'].hasOwnProperty(permission)) {
          const currentPermission = currentRole['permissions'][permission];
          if ( ! result['permissions'].includes(currentPermission['code'])) {
            result['permissions'].push(currentPermission['code']);
          }
        }
      }
    }
  }
  return result;
}
