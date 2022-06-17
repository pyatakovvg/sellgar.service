
import unit from './unit.mjs';
import group from './group.mjs';
import brand from './brand.mjs';
import currency from './currency.mjs';
import category from './category.mjs';
import products from './products.mjs';
import attribute from './attribute.mjs';


export default (router) => {

  unit(router);
  brand(router);
  group(router);
  currency(router);
  category(router);
  products(router);
  attribute(router);
};
