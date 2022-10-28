
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products')
class CheckController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const db = super.plugin.get('db');

    const Comment = db.model['Comment'];
    const Product = db.model['Product'];


    const result = await db.manager.transaction(async (entityManager) => {
      const commentRepository = entityManager.getTreeRepository(Comment);

      const queryBuilder = entityManager.createQueryBuilder(Product, 'product');

      if ('uuid' in query) {
        queryBuilder.andWhere('product.uuid IN (:...productUuid)', { productUuid: query['uuid'] });
      }

      queryBuilder
        .leftJoinAndSelect('product.comments', 'comment', 'comment.parentUuid IS NULL')
        .loadRelationCountAndMap('product.allCommentCount', 'product.comments', 'allComments', (qb) => {
          return qb.where('allComments.parentUuid IS NULL');
        })
        .loadRelationCountAndMap('product.newCommentCount', 'product.comments', 'newComments', (qb) => {
          return qb
            .where('newComments.parentUuid IS NULL')
            .innerJoin('newComments.status', 'status', 'status.code = :code', {
            code: 'new'
          });
        })
        .addOrderBy('comment.createdAt', 'ASC');

      if (('take' in query) && ('skip' in query)) {
        queryBuilder
          .offset(query['skip'][0])
          .limit(query['take'][0]);
      }

      const products = await queryBuilder.getManyAndCount();

      const resultProducts = [];

      for (let indexProduct in products[0]) {
        const product = products[0][indexProduct];
        const comments = product['comments'];

        resultProducts[indexProduct] = product;

        for (let indexComment in comments) {
          const comment = comments[indexComment];

          resultProducts[indexProduct]['comments'][indexComment] = await commentRepository.findDescendantsTree(comment);
        }
      }

      return [resultProducts, products[1]];
    });

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default CheckController;
