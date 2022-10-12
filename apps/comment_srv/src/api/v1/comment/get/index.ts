
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/comments/:uuid')
class GetCommentController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Comment = db.model['Comment'];


    const result = await db.manager.transaction(async (entityManager) => {
      const commentRepository = entityManager.getRepository(Comment);
      const commentRepositoryTree = entityManager.getTreeRepository(Comment);

      const queryBuilder = await commentRepository.createQueryBuilder('comment')
        .where('comment.parentUuid IS NULL')

        .leftJoinAndSelect('comment.product', 'product')
        .leftJoinAndSelect('comment.status', 'status');

      if (('skip' in query) && ('take' in query)) {
        queryBuilder
          .offset(Number(query['skip'][0]))
          .limit(Number(query['take'][0]));
      }

      queryBuilder.addOrderBy('comment.createdAt', 'DESC');

      const comments = await queryBuilder.getManyAndCount();

      for (let index in comments[0]) {
        const comment = comments[0][index];
        comments[0][index] = await commentRepositoryTree.findDescendantsTree(comment, {
          relations: ['product', 'status']
        });
      }

      return comments;
    });

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetCommentController;
