
import { get, create, update, destroy } from '../controllers/user';


export default (router) => {

  router.get('/api/v1/users', get());
  router.post('/api/v1/users', create());
  router.put('/api/v1/users/:uuid', update());
  router.delete('/api/v1/users/:uuid', destroy());
}
