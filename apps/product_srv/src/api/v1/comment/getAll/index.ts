
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/comments')
class CheckController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');
    const Comment = db.model['Comment'];

    const repository = db.manager.getTreeRepository(Comment);
    const queryBuilder = repository.createDescendantsQueryBuilder('comment', 'comment.children', { uuid: 'b32a089d-221c-4c7f-9364-86cdb91731d0'})

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(null)
      .meta({
        totalRows: 0,
      })
      .build();
  }
}

export default CheckController;
