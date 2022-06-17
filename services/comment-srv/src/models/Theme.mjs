
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType)  {
  const { Model } = Sequelize;

  class Theme extends Model {}

  Theme.init({
    uuid: {
      type: DataType.UUID,
      allowNull: true,
      primaryKey: true,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    name: {
      type: DataType.STRING(64),
      allowNull: false,
    },
    order: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Theme.associate = ({}) => {};

  return Theme;
};
