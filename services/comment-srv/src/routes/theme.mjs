
import { get, create } from '../controllers/theme';


export default (router) => {

  router.get('/api/v1/themes', get());
  router.post('/api/v1/themes', create());
};
