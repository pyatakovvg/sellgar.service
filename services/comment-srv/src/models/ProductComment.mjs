
import { Sequelize } from '@sellgar/db';


export default function(sequelize) {
  const { Model } = Sequelize;

  class ProductComment extends Model {}

  ProductComment.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'ProductComment',
  });

  return ProductComment;
};
