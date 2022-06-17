
import { register, unregister } from "../controllers/worker";


export default (router) => {

  router.post('/api/v1/register', register());
  router.post('/api/v1/unregister', unregister());
};
