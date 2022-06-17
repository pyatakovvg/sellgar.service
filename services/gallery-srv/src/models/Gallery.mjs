
import { Sequelize } from '@sellgar/db';


export default function(sequelize, DataType)  {
  const { Model } = Sequelize;

  class Gallery extends Model {}

  Gallery.init({
    uuid: {
      type: DataType.STRING(40),
      primaryKey: true,
      index: true,
      unique: true,
    },
    name: {
      type: DataType.STRING(32),
      allowNull: true,
    },
    small: {
      type: DataType.BLOB,
    },
    middle: {
      type: DataType.BLOB,
    },
    large: {
      type: DataType.BLOB,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  Gallery.associate = ({}) => {};

  return Gallery;
};
