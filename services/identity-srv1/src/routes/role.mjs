
import { get, create, update, destroy } from '../controllers/role';


export default (router) => {

  router.get('/api/v1/roles', get());
  router.post('/api/v1/roles', create());
  router.put('/api/v1/roles/:uuid', update());
  router.delete('/api/v1/roles/:uuid', destroy());
}
