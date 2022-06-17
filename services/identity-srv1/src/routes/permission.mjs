
import { get, create, update, destroy } from '../controllers/permission';


export default (router) => {

  router.get('/api/v1/permissions', get());
  router.post('/api/v1/permissions', create());
  router.put('/api/v1/permissions/:uuid', update());
  router.delete('/api/v1/permissions/:uuid', destroy());
}
