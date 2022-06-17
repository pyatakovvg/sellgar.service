
import { get, create } from '../controllers/attribute';


export default function(router) {

  router.get('/api/v1/attributes', get());
  router.post('/api/v1/attributes', create());
}
