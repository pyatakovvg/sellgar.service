
import { get, create, update, destroy } from '../controllers/comment';


export default (router) => {

  router.get('/api/v1/comments', get());
  router.post('/api/v1/comments', create());
  router.put('/api/v1/comments/:uuid', update());
  router.delete('/api/v1/comments/:uuid', destroy());
};
