
function init({ sequelize, DataTypes, Model }): any {
  class Permission extends Model {}

  Permission.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      index: true,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(64),
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
}

export default init;