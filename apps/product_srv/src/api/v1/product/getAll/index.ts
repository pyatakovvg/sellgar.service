
import { queryNormalize } from '@helper/utils';
import { Controller, Result, Route } from '@library/app';

import catalogBuilder from '../_builder/catalog';


function getAttrsFilter(query: any) {
  const attrsKey = Object.keys(query).filter((key) => /^attr/.test(key));
  const attrsCode = {};
  for (let index in attrsKey) {
    const key = attrsKey[index];
    const attrCode = key.replace(/[\[\]]+/g, '').match(/^attr(.*)/)[1];
    attrsCode[attrCode] = query[key];
  }
  return attrsCode;
}


@Route('get', '/api/v1/products')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const attrQuery = getAttrsFilter(query);

    const db = super.plugin.get('db');

    const Store = db.model['Store'];
    const Catalog = db.model['Catalog'];


    const result = await db.manager.transaction(async (entityManager) => {
      const queryBuilder = entityManager.createQueryBuilder(Catalog, 'catalog');

      queryBuilder
        .select('catalog')
        .select((qb) => {
          return qb
            .select('price')
            .from(Store, 'store')
            .innerJoin('store.product', 'product', 'product.isTarget is true')
            .innerJoin('product.catalog', 'cc', 'cc.uuid = "catalog"."uuid"');
        }, 'price')
        .addOrderBy('price', 'ASC')

      if ('uuid' in query) {
        queryBuilder.andWhere('catalog.uuid IN (:...catalogUuid)', { catalogUuid: query['uuid'] });
      }

      if ('externalId' in query) {
        queryBuilder.andWhere('catalog.externalId IN (:...externalId)', { externalId: query['externalId'] });
      }

      if ('isUse' in query) {
        queryBuilder.andWhere('catalog.isUse IN (:...isUse)', { isUse: query['isUse'] });
      }

      queryBuilder
        .leftJoinAndSelect('catalog.group', 'group')


      if ('groupCode' in query) {
        queryBuilder.andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
      }

      if ('groupUuid' in query) {
        queryBuilder.andWhere('group.uuid IN (:...groupUuid)', {groupUuid: query['groupUuid']});
      }

      queryBuilder
        .leftJoinAndSelect('catalog.category', 'category')

      if ('categoryCode' in query) {
        queryBuilder.andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
      }

      if ('categoryUuid' in query) {
        queryBuilder.andWhere('category.uuid IN (:...categoryUuid)', { categoryUuid: query['categoryUuid'] });
      }

      if ('brandCode' in query) {
        queryBuilder
          .innerJoin('catalog.products', 'b_products')
          .innerJoin('b_products.product', 'b_product')
          .innerJoin('b_product.brand', 'brand', 'brand.code IN (:...brandCode)', { brandCode: query['brandCode'] })
      }

      if ('brandUuid' in query) {
        queryBuilder
          .innerJoin('catalog.products', 'b_products')
          .innerJoin('b_products.product', 'b_product')
          .innerJoin('b_product.brand', 'brand', 'brand.uuid IN (:...brandUuid)', { brandUuid: query['brandUuid'] })
      }

      if (('skip' in query) && ('take' in query)) {
        queryBuilder
          .limit(Number(query['take'][0]))
          .offset(Number(query['skip'][0]));
      }

      const products = await queryBuilder.getManyAndCount();

      for (let index in products[0]) {
        const product = products[0][index];
        const queryBuilder = entityManager.createQueryBuilder(Catalog, 'catalog');

        queryBuilder
          .select(['catalog.uuid'])
          .where('catalog.uuid = :productUuid', { productUuid: product['uuid'] })

          .leftJoin('catalog.images', 'product_image')
          .addSelect(['product_image.uuid'])

          .addOrderBy('product_image.order', 'ASC')
          .leftJoin('product_image.image', 'image')
          .addSelect(['image.uuid', 'image.name'])

          .leftJoin('catalog.attributes', 'attribute')
          .addSelect(['attribute.uuid', 'attribute.name'])
          .addOrderBy('attribute.order', 'ASC')

          .leftJoin('attribute.values', 'value')
          .addSelect(['value.uuid', 'value.value'])
          .addOrderBy('value.order', 'ASC');

        if ( !! Object.keys(attrQuery).length) {
          const values = Object.keys(attrQuery).reduce((accum, item) => [...accum, ...(attrQuery[item])], []);
          queryBuilder
            .andWhere('value.value IN (:...values)', { values });
        }

        queryBuilder
          .leftJoin('value.attribute', 'value_attribute')
          .addSelect(['value_attribute.uuid', 'value_attribute.code', 'value_attribute.name', 'value_attribute.description'])

        if ( !! Object.keys(attrQuery).length) {
          const a_codes = Object.keys(attrQuery);
          queryBuilder
            .andWhere('value_attribute.code IN (:...a_codes)', { a_codes });
        }

        queryBuilder
          .leftJoin('value_attribute.unit', 'unit')
          .addSelect(['unit.uuid', 'unit.name', 'unit.description'])

        queryBuilder
          .leftJoinAndSelect('catalog.products', 'products')
          .leftJoinAndSelect('products.product', 'product')
          .leftJoinAndSelect('product.brand', 'brand')
          .leftJoinAndSelect('brand.images', 'b_image')
          .leftJoinAndSelect('product.currency', 'currency')
          .addOrderBy('products.order', 'ASC')

        const resultProduct = await queryBuilder.getOne();

        product['images'] = resultProduct['images'];
        product['products'] = resultProduct['products'];
        product['attributes'] = resultProduct['attributes'];
      }

      return products;
    });

    return new Result()
      .data(result[0].map(catalogBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetProductsController;
