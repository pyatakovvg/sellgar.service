
import { queryNormalize } from '@helper/utils';
import { Controller, Result, Route } from '@library/app';

import productBuilder from './builders/product';


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
    const Product = db.model['Product'];


    const result = await db.manager.transaction(async (entityManager) => {
      const repositoryProduct = entityManager.getRepository(Product);

      let queryBuilder = repositoryProduct.createQueryBuilder('product')
        .select(['product.uuid', 'product.externalId', 'product.title', 'product.description', 'product.price',
          'product.purchasePrice', 'product.vendor', 'product.barcode', 'product.isUse', 'product.isAvailable', 'product.createdAt',
          'product.updatedAt']);

      if (('skip' in query) && ('take' in query)) {
        queryBuilder
          .limit(Number(query['take'][0]))
          .offset(Number(query['skip'][0]));
      }

      if ('uuid' in query) {
        queryBuilder.andWhere('product.uuid IN (:...uuid)', { uuid: query['uuid'] });
      }

      if ('externalId' in query) {
        queryBuilder.andWhere('product.externalId IN (:...externalId)', { externalId: query['externalId'] });
      }

      if ('isUse' in query) {
        queryBuilder.andWhere('product.isUse IN (:...isUse)', { isUse: query['isUse'] });
      }

      if ('isAvailable' in query) {
        queryBuilder.andWhere('product.isAvailable IN (:...isAvailable)', { isAvailable: query['isAvailable'] });
      }

      queryBuilder
        .leftJoin('product.group', 'group')
        .addSelect(['group.uuid', 'group.name', 'group.code', 'group.description'])

      if ('groupCode' in query) {
        queryBuilder.andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
      }

      if ('groupUuid' in query) {
        queryBuilder.andWhere('group.uuid IN (:...groupUuid)', { groupUuid: query['groupUuid'] });
      }

      queryBuilder
        .leftJoin('product.category', 'category')
        .addSelect(['category.uuid', 'category.name', 'category.code', 'category.description']);

      if ('categoryCode' in query) {
        queryBuilder.andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
      }

      if ('categoryUuid' in query) {
        queryBuilder.andWhere('category.uuid IN (:...categoryUuid)', { categoryUuid: query['categoryUuid'] });
      }

      queryBuilder
        .leftJoin('product.brand', 'brand')
        .addSelect(['brand.uuid', 'brand.name', 'brand.code', 'brand.description'])

        .leftJoinAndSelect('brand.images', 'images');

      if ('brandCode' in query) {
        queryBuilder.andWhere('brand.code IN (:...brandCode)', { brandCode: query['brandCode'] });
      }

      if ('brandUuid' in query) {
        queryBuilder.andWhere('brand.uuid IN (:...brandUuid)', { brandUuid: query['brandUuid'] });
      }

      queryBuilder
        .leftJoin('product.currency', 'currency')
        .addSelect(['currency.code', 'currency.displayName'])

        .addOrderBy('product.price', 'ASC');

      const products = await queryBuilder.getManyAndCount();

      for (let index in products[0]) {
        const product = products[0][index];
        let queryBuilder = repositoryProduct.createQueryBuilder('product')
          .select(['product.uuid'])
          .where('product.uuid = :productUuid', { productUuid: product['uuid'] })

          .leftJoin('product.images', 'product_image')
          .addSelect(['product_image.uuid'])

          .addOrderBy('product_image.order', 'ASC')

          .leftJoin('product_image.image', 'image')
          .addSelect(['image.uuid', 'image.name'])

          .leftJoin('product.attributes', 'attribute')
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

        const resultProduct = await queryBuilder.getOne();

        product['images'] = resultProduct['images'];
        product['attributes'] = resultProduct['attributes'];
      }

      return products;
    })

    return new Result()
      .data(result[0].map(productBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetProductsController;
