
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class ProductAttribute extends Model {}

  ProductAttribute.init({
    value: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  ProductAttribute.associate = () => {};

  return ProductAttribute;
};
