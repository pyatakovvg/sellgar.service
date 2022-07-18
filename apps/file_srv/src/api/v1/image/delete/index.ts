
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/images/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const params = super.params;
    const db = super.plugin.get('db');
    const rabbit = super.plugin.get('rabbit');

    const Image = db.models['Image'];

    await Image.destroy({
      where: {
        uuid: params['uuid']
      },
    });

    await rabbit.sendEvent(process.env['FILE_SRV_IMAGE_DELETE_QUEUE'], params['uuid']);

    return new Result()
      .data(params)
      .build();
  };
}

export default ImageController;
