
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class Permission extends Model {}

  Permission.init({
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

  Permission.associate = ({ Role, RolePermissions }) => {

    Permission.belongsToMany(Role, {
      through: RolePermissions,
      foreignKey: 'permissionUuid',
      as: 'roles',
    });
  };

  return Permission;
};
