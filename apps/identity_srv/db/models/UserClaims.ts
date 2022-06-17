
function init({ sequelize, DataTypes, Model }): any {
  class UserClaim extends Model {}

  UserClaim.init({
    value: {
      type: DataTypes.STRING(128),
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
  });

  UserClaim.associate = function({}) {};

  return UserClaim;
}

export default init;
