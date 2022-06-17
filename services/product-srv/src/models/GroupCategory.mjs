
import { Sequelize } from '@sellgar/db';


export default function(sequelize) {
  const { Model } = Sequelize;

  class GroupCategory extends Model {}

  GroupCategory.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'GroupCategory',
  });

  return GroupCategory;
};
