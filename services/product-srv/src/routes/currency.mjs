
import { get } from '../controllers/currency';


export default function(router) {

  router.get('/api/v1/currencies', get());
}
