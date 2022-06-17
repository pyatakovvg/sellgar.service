
import { Sequelize } from '@sellgar/db';


export default function(sequelize) {
  const { Model } = Sequelize;

  class CustomerComment extends Model {}

  CustomerComment.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'CustomerComment',
  });

  return CustomerComment;
};
