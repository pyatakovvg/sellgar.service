
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Role extends Model {}

  Role.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      unique: true,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    code: {
      type: DataType.STRING(64),
      allowNull: false,
    },
    displayName: {
      type: DataType.STRING(64),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  Role.associate = ({ Permission, User, RolePermissions, UserRoles }) => {

    Role.belongsToMany(Permission, {
      through: RolePermissions,
      foreignKey: 'roleUuid',
      as: 'permissions',
    });

    Role.belongsToMany(User, {
      through: UserRoles,
      foreignKey: 'roleUuid',
      as: 'users',
    });
  };

  return Role;
};
