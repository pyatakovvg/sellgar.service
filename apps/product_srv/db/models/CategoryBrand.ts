
function init({ sequelize, Model }): any {
  class CategoryBrand extends Model {}

  CategoryBrand.init({}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'CategoryBrand',
  });

  return CategoryBrand;
}

export default init;
