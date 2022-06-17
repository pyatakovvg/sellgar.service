
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class ProductGallery extends Model {}

  ProductGallery.init({
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUuid: {
      type: DataType.STRING(40),
      allowNull: false,
    },
    productUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    order: {
      type: DataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  return ProductGallery;
};
