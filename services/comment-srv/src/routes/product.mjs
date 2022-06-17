
import { get, create, update, destroy } from '../controllers/product';


export default (router) => {

  router.get('/api/v1/comments/products', get());
  router.post('/api/v1/comments/products', create());
  router.put('/api/v1/comments/products/:uuid', update());
  router.delete('/api/v1/comments/products/:uuid', destroy());
};
