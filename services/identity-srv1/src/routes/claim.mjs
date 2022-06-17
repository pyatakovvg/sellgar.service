
import { get, create, update, destroy } from '../controllers/claim';


export default (router) => {

  router.get('/api/v1/claims', get());
  router.post('/api/v1/claims', create());
  router.put('/api/v1/claims/:uuid', update());
  router.delete('/api/v1/claims/:uuid', destroy());
}
