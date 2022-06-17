
import user from './user';
import order from './order';


export default async function() {

  await user();
  await order();
}
