
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType) {
  const { Model } = Sequelize;

  class Status extends Model {}

  Status.init({
    code: {
      type: DataType.STRING,
      primaryKey: true,
    },
    displayName: {
      type: DataType.STRING,
      allowNull: false,
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

  return Status;
};
