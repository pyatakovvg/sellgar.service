
import { get, create } from '../controllers/category';


export default function(router) {

  router.get('/api/v1/categories', get());
  router.post('/api/v1/categories', create());
}
