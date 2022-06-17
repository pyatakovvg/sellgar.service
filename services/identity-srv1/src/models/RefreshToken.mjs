
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class RefreshToken extends Model {}

  RefreshToken.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    userUuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    refreshToken: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    userAgent: {
      type: DataType.STRING(255),
    },
    ip: {
      type: DataType.STRING(15),
    },
    expiresIn: {
      type: DataType.BIGINT,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  return RefreshToken;
};
