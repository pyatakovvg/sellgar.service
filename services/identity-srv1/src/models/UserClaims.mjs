
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class UserClaim extends Model {}

  UserClaim.init({
    value: {
      type: DataType.STRING(128),
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
  });

  UserClaim.associate = function({}) {};

  return UserClaim;
};
