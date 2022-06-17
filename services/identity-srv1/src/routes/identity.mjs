
import { signIn, check, refresh } from '../controllers/identity';


export default (router) => {

  router.post('/api/v1/check', check());
  router.post('/api/v1/refresh', refresh());
  router.post('/api/v1/sign-in', signIn());
}
