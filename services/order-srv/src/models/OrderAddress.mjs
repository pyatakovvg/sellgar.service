
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class OrderAddress extends Model {}

  OrderAddress.init({
    orderUuid: {
      type: DataType.UUID,
      allowNull: false,
      primaryKey: true,
    },
    city: {
      type: DataType.STRING,
      allowNull: false,
    },
    street: {
      type: DataType.STRING,
      allowNull: false,
    },
    house: {
      type: DataType.STRING,
      allowNull: false,
    },
    building: {
      type: DataType.STRING,
      allowNull: true,
    },
    apartment: {
      type: DataType.STRING,
      allowNull: true,
    },
    floor: {
      type: DataType.STRING,
      allowNull: true,
    },
    front: {
      type: DataType.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  OrderAddress.associate = () => {};

  return OrderAddress;
};
