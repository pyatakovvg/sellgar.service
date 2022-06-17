
import { get, create } from '../controllers/brand';


export default function(router) {

  router.get('/api/v1/brands', get());
  router.post('/api/v1/brands', create());
}
