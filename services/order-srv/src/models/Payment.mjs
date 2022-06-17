
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Payment extends Model {}

  Payment.init({
    code: {
      type: DataType.STRING,
      primaryKey: true,
    },
    displayName: {
      type: DataType.STRING,
      allowNull: false,
    },
    isUse: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    order: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Payment.associate = () => {};

  return Payment;
};
