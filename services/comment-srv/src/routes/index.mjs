
import theme from './theme.mjs';
import comment from './comment.mjs';
import product from './product.mjs';


export default (router) => {

  theme(router);
  comment(router);
  product(router);
};
