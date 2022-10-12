
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/comments')
class CreateCommentController extends Controller {
  async send(): Promise<any> {
    const data = super.body;
    const db = super.plugin.get('db');

    const Comment = db.models['Comment'];

    await Comment.create(data);

    return new Result()
      .data(null)
      .build();
  }
}

export default CreateCommentController;
