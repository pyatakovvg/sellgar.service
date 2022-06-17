
function init({ sequelize, Model }): any {
  class RolePermissions extends Model {}

  RolePermissions.init({}, {
    sequelize,
    timestamps: false,
  });

  RolePermissions.associate = ({}) => {};

  return RolePermissions;
}

export default init;
