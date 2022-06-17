
import { get, create } from '../controllers/unit';


export default function(router) {

  router.get('/api/v1/units', get());
  router.post('/api/v1/units', create());
}
