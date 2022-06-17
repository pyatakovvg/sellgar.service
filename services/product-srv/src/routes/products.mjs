
import { get, create, update, destroy } from '../controllers/product';


export default function(router) {

  router.get('/api/v1/products', get());
  router.post('/api/v1/products', create());
  router.put('/api/v1/products/:uuid', update());
  router.delete('/api/v1/products/:uuid', destroy());
}
