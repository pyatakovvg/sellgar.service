
import { Sequelize } from '@sellgar/db';


export default function (sequelize, DataType) {
  const { Model } = Sequelize;

  class User extends Model {}

  User.init({
    uuid: {
      type: DataType.UUID,
      primaryKey: true,
      unique: true,
      index: true,
      defaultValue: DataType.UUIDV4,
    },
    login: {
      type: DataType.STRING(64),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataType.STRING(128),
      allowNull: false,
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
};
