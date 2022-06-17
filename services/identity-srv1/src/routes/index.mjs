
import role from './role.mjs';
import user from './user.mjs';
import claim from './claim.mjs';
import identity from './identity.mjs';
import permission from './permission.mjs';


export default (router) => {

  role(router);
  user(router);
  claim(router);
  identity(router);
  permission(router);
};
