
function init({ sequelize, Model }): any {
  class UserRole extends Model {}

  UserRole.init({}, {
    sequelize,
    timestamps: false,
  });

  UserRole.associate = function({}) {};

  return UserRole;
}

export default init;
