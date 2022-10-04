
import { queryNormalize } from '@helper/utils';
import { Controller, Result, Route } from '@library/app';

import productBuilder from './builders/product';


function getAttrsFilter(query: any) {
  const attrsKey = Object.keys(query).filter((key) => /^attr/.test(key));
  const attrsCode = [];
  for (let index in attrsKey) {
    const key = attrsKey[index];
    const attrCode = key.match(/^attr\[(.*)\]/)[1];
    attrsCode[attrCode] = query[key];
  }
  return attrsCode;
}


@Route('get', '/api/v1/products')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Product = db.model['Product'];


    const repository = db.repository(Product);
    let queryBuilder = repository.createQueryBuilder('product')
      .select(['product.uuid', 'product.externalId', 'product.title', 'product.description', 'product.price',
        'product.isUse', 'product.isAvailable', 'product.createdAt', 'product.updatedAt']);

    // const attrQuery = getAttrsFilter(data);

    // if ('sort' in data) {
    //   switch (Number(data['sort'])) {
    //     case 1: {
    //       order.push(['amount', 'asc']);
    //     } break;
    //     case 2: {
    //       order.push(['amount', 'desc']);
    //     } break;
    //     case 3: {
    //       order.push(['title', 'asc']);
    //     } break;
    //   }
    // }
    // else {
    //   order.push(['createdAt', 'asc']);
    // }

    if ('uuid' in query) {
      queryBuilder.andWhere('product.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if ('externalId' in query) {
      queryBuilder.andWhere('product.externalId IN (:...externalId)', { externalId: query['externalId'] });
    }

    if ('isUse' in query) {
      queryBuilder.andWhere('product.isUse IN (:...isUse)', { isUse: query['isUse'] });
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
      .addSelect(['brand.uuid', 'brand.name', 'brand.code', 'brand.description']);

    if ('brandCode' in query) {
      queryBuilder.andWhere('brand.code IN (:...brandCode)', { brandCode: query['brandCode'] });
    }

    if ('brandUuid' in query) {
      queryBuilder.andWhere('brand.uuid IN (:...brandUuid)', { brandUuid: query['brandUuid'] });
    }

    if ('isUse' in query) {
      queryBuilder.andWhere('product.isUse IN (:...isUse)', { isUse: query['isUse'] });
    }

    if ('isAvailable' in query) {
      queryBuilder.andWhere('product.isAvailable IN (:...isAvailable)', { isAvailable: query['isAvailable'] });
    }

    // if ( !! Object.keys(attrQuery).length) {
    //   const bulk = [];
    //   const keys = Object.keys(attrQuery);
    //
    //   for (let index in keys) {
    //     const key = keys[index];
    //
    //     const result = await Attribute.findOne({
    //       raw: true,
    //       where: {
    //         code: key,
    //       },
    //       attributes: ['uuid'],
    //     });
    //
    //     bulk.push({
    //       attributeUuid: result['uuid'],
    //       value: attrQuery[key],
    //     });
    //   }
    //
    //   whereAttr[db.Op.or] = bulk;
    //   whereAttrRequired = true;
    // }

    queryBuilder
      .leftJoin('product.currency', 'currency')
      .addSelect(['currency.code', 'currency.displayName'])

      .leftJoin('product.attributes', 'attribute')
      .addSelect(['attribute.uuid', 'attribute.name'])

        .leftJoin('attribute.values', 'value')
        .addSelect(['value.uuid', 'value.value'])

          .leftJoin('value.attribute', 'value_attribute')
          .addSelect(['value_attribute.uuid', 'value_attribute.code', 'value_attribute.name', 'value_attribute.description'])

            .leftJoin('value_attribute.unit', 'unit')
            .addSelect(['unit.uuid', 'unit.name', 'unit.description'])

      .leftJoin('product.images', 'product_image')
      .addSelect(['product_image.uuid'])

        .leftJoin('product_image.image', 'image')
        .addSelect(['image.uuid', 'image.name'])

      .addOrderBy('value.order', 'ASC')
      .addOrderBy('product.price', 'ASC')
      .addOrderBy('attribute.order', 'ASC')
      .addOrderBy('product_image.order', 'ASC');

    if ('skip' in query) {
      queryBuilder.offset(Number(query['skip'][0]));
    }

    if ('take' in query) {
      queryBuilder.limit(Number(query['take'][0]));
    }

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0].map(productBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetProductsController;
