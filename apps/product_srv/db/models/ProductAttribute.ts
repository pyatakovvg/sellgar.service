
function init({ sequelize, DataTypes, Model }): any {
  class ProductAttribute extends Model {}

  ProductAttribute.init({
    value: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    sequelize,
    timestamps: false,
  });

  ProductAttribute.associate = () => {};

  return ProductAttribute;
}

export default init;
