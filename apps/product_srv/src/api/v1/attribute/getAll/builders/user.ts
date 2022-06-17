
import roleBuilder from './role';
import claimBuilder from './claim';


export default function(data) {
  return {
    uuid: data['uuid'],
    login: data['login'],
    createdAt: data['createdAt'],
    updatedAt: data['updatedAt'],
    claims: data['claims'].map((claim) => claimBuilder(claim)),
    roles: data['roles'].map((role) => roleBuilder(role)),
  };
}
