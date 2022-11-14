
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/images/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const params = super.params;
    const rabbit = super.plugin.get('rabbit');

    const db = super.plugin.get('db');
    const Image = db.model['Image'];

    const repository = db.repository(Image);
    const queryBuilder = repository.createQueryBuilder();

    await queryBuilder
      .delete()
      .from(Image)
      .where('uuid = :uuid', { uuid: params['uuid'] })
      .execute();

    await rabbit.sendEvent(process.env['FILE_SRV_IMAGE_DELETE_EXCHANGE'], params['uuid']);

    return new Result()
      .data(params)
      .build();
  }
}

export default ImageController;
