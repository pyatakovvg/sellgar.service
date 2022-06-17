
import { get, create, update, destroy } from '../controllers/customer';


export default (router) => {

  router.get('/api/v1/customers', get());
  router.post('/api/v1/customers', create());
  router.put('/api/v1/customers/:uuid', update());
  router.delete('/api/v1/customers/:uuid', destroy());
};
