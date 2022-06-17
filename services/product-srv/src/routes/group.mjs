
import { get, create } from '../controllers/group';


export default function(router) {

  router.get('/api/v1/groups', get());
  router.post('/api/v1/groups', create());
}
