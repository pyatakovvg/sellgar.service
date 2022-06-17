
import { Sequelize } from '@sellgar/db';


export default function (sequelize) {
  const { Model } = Sequelize;

  class UserRole extends Model {}

  UserRole.init({}, {
    sequelize,
    timestamps: false,
  });

  UserRole.associate = function({}) {};

  return UserRole;
};
