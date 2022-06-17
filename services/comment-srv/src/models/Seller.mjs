
import { Sequelize } from '@sellgar/db';

export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Seller extends Model {}

  Seller.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(64),
      allowNull: true,
      defaultValue: 'No name',
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Seller.associate = () => {};

  return Seller;
};
