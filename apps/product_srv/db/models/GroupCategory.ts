
function init({ sequelize, Model }): any {
  class GroupCategory extends Model {}

  GroupCategory.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'GroupCategory',
  });

  return GroupCategory;
}

export default init;
