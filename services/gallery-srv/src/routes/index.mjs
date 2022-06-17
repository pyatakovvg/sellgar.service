
import { getImages, getImage, deleteImages, createImage, updateImage } from '../controllers/Gallery';


export default (router) => {

  router.get('/api/v1/images', getImages());
  router.get('/api/v1/images/:id', getImage());
  router.post('/api/v1/images', createImage());
  router.put('/api/v1/images/:uuid', updateImage());
  router.delete('/api/v1/images', deleteImages());
};
