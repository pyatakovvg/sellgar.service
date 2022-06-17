
import { Sequelize } from '@sellgar/db';


export default function(sequelize) {
  const { Model } = Sequelize;

  class CategoryBrand extends Model {}

  CategoryBrand.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'CategoryBrand',
  });

  return CategoryBrand;
};
