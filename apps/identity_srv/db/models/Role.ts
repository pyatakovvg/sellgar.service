
function init({ sequelize, DataTypes, Model }): any {
  class Role extends Model {}

  Role.init({
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
}

export default init;
