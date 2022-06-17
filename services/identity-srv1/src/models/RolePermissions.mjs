
import { Sequelize } from '@sellgar/db';


export default function (sequelize) {
  const { Model } = Sequelize;

  class RolePermissions extends Model {}

  RolePermissions.init({}, {
    sequelize,
    timestamps: false,
  });

  RolePermissions.associate = ({}) => {};

  return RolePermissions;
};
