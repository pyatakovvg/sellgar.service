
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Currency extends Model {}

  Currency.init({
    code: {
      type: DataType.STRING(4),
      primaryKey: true,
      allowNull: false,
    },
    displayName: {
      type: DataType.STRING(16),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Currency.associate = () => {};

  return Currency;
};
