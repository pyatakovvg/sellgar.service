
function init({ sequelize, DataTypes, Model }): any {
  class User extends Model {}

  User.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      index: true,
      defaultValue: DataTypes.UUIDV4,
    },
    login: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    parentUuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: true,
  });

  User.associate = function({ Role, Claim, UserClaims, UserRoles }) {

    User.belongsToMany(Claim, {
      through: UserClaims,
      foreignKey: 'userUuid',
      as: 'claims',
    });

    User.belongsToMany(Role, {
      through: UserRoles,
      foreignKey: 'userUuid',
      as: 'roles',
    });
  };

  return User;
}

export default init;
